import generate from '@babel/generator'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

export default function getWXML(path: NodePath<t.Expression>) {
  const node = t.cloneNode(path.node, true, true)
  const parent = t.jsxExpressionContainer(node as t.Expression)
  traverse(parent, {
    noScope: true,
    /**
     a.map((item, index) => <div></div>)
     ->
     <div wx:for={a} wx:for-item={item} wx:for-index={index}></div>
    */
    CallExpression: {
      enter: path => {
        const callee = path.node.callee
        const arrowFn = path.node.arguments[0]
        if (t.isMemberExpression(callee) && t.isArrowFunctionExpression(arrowFn)) {
          if (!t.isBlockStatement(arrowFn.body) && t.isIdentifier(arrowFn.params[0]) && t.isIdentifier(arrowFn.params[1])) {
            const node = expressionToJSXElement(arrowFn.body)
            node.openingElement.attributes.push(
              t.jsxAttribute(
                t.jsxIdentifier('wx:for'),
                t.jsxExpressionContainer(
                  callee.object
                )
              ),
              t.jsxAttribute(
                t.jsxIdentifier('wx:for-item'),
                t.stringLiteral(
                  arrowFn.params[0].name
                )
              ),
              t.jsxAttribute(
                t.jsxIdentifier('wx:for-index'),
                t.stringLiteral(
                  arrowFn.params[1].name
                )
              )
            )
            path.replaceWith(node)
          }
        }
      }
    },
    /**
      a ? b : <div>c</div>
      ->
      <block wx:if={a}>b</block>
      <div wx:else>c</div>
     */
    ConditionalExpression: {
      exit: path => {
        const node = path.node
        const consequent = expressionToJSXElement(node.consequent)
        consequent.openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('wx:if'),
            t.jsxExpressionContainer(
              node.test
            )
          )
        )
        const alternate = expressionToJSXElement(node.alternate)
        alternate.openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('wx:else')
          )
        )
        if (!path.parentPath) {
          path.replaceWith(t.arrayExpression([
            consequent,
            alternate
          ]))
        }
        // 如果位于jsxElement不需要block
        else if (path.parentPath.parentPath?.isJSXElement()) {
          path.parentPath.replaceWithMultiple([
            consequent,
            alternate
          ])
        }
        else {
          path.replaceWith(
            createBlock([
              consequent,
              alternate
            ])
          )
        }
      }
    },
    /**
      1. a && <div></div> -> <div wx:if={a}></div>
      2. a && b -> <block wx:if={a}>{b}</block>
      3. a || b -> <block wx:if={!a}>{b}</block>
     */
    LogicalExpression: {
      exit: path => {
        const node = expressionToJSXElement(path.node.right)
        node.openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('wx:if'),
            t.jsxExpressionContainer(
              path.node.operator === '||' ?
                t.unaryExpression('!', path.node.left) :
                path.node.left
            )
          )
        )
        path.replaceWith(node)
      }
    },
    /**
      [<div></div>] -> <div></div>
      [<div></div>, <div></div>, 1, '2'] 
      -> 
      <block>
        <div></div>
        <div></div>
        <block>{1}</block>
        <block>{'2'}</block>
      </block>
     */
    ArrayExpression: {
      exit: path => {
        const nodes = path.node.elements
          .filter(item => t.isExpression(item))
          .map(item => expressionToJSXElement(item as t.Expression))
        path.replaceWith(
          nodes.length === 1 ? nodes[0] : createBlock(nodes)
        )
      }
    },
    /**
     1. {<div></div>} -> <div></div>
     2. <div prop={expression}>{expression}</div> 
        -> 
        <div prop="{{ expression }}">{{ expression }}</div>
     */
    JSXExpressionContainer: {
      exit: path => {
        const expression = path.get('expression')
        if (expression.isJSXElement()) {
          path.replaceWith(expression)
        } else {
          const code = expression.isStringLiteral() ? expression.node.value : '{{' + generate(expression.node, {
            jsonCompatibleStrings: false,
            comments: false
          }).code.replace(/"/g, "'") + '}}'

          if (path.parentPath?.isJSXElement()) {
            path.replaceWith(
              t.jsxText(code)
            )
          } else {
            const node = t.stringLiteral(code)
            node.extra = {
              raw: '"' + node.value + '"',
              rawValue: node.value
            }
            path.replaceWith(node)
          }
        }
      }
    },
    NullLiteral: {
      enter: path => {
        if (path.parentPath.isConditionalExpression()) {
          path.replaceWith(
            t.stringLiteral('')
          )
        }
      }
    },
    JSXElement: {
      enter: path => {
        const openingElement = path.get('openingElement')
        const jsxName = openingElement.get('name')
        if (jsxName.isJSXIdentifier() && jsxName.node.name === 'div') {
          jsxName.replaceWith(
            t.jsxIdentifier('view')
          )
          const closingElement = path.get('closingElement')
          if (closingElement.isJSXClosingElement()) {
            const closeName = closingElement.get('name')
            if (closeName.isJSXIdentifier() && closeName.node.name === 'div') {
              closeName.replaceWith(
                t.jsxIdentifier('view')
              )
            }
          }
        }
      }
    },
    JSXAttribute: {
      enter: path => {
        if (path.node.name.name === 'key') {
          path.get('name').replaceWith(
            t.jsxIdentifier('wx:key')
          )
        }
      }
    }
  })
  return parent.expression
}


/**
 * 1. <div></div> -> <div></div>
 * 2. '123' -> <block>123</block>
 * 3. expression -> <block>{expression}</block>
 */
function expressionToJSXElement(expression: t.Expression) {
  return t.isJSXElement(expression) ? expression : createBlock([t.isStringLiteral(expression) ? t.jsxText(expression.value) : t.jsxExpressionContainer(expression)])
}

function createBlock(children: (t.JSXElement | t.JSXExpressionContainer | t.JSXText)[]) {
  return t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier('block'),
      []
    ),
    t.jsxClosingElement(
      t.jsxIdentifier('block')
    ),
    children,
    false
  )
}