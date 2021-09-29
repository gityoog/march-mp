import { NodePath } from "@babel/traverse"
import * as t from '@babel/types'
import generate from '@babel/generator'
import State from "../../state"

// todo 修改为排除原则
export default function genData(path: NodePath<t.Expression>, state: State) {
  (path.parentPath || path).traverse({
    /**
      1. a.call(b) -> $data
      2. 转换map函数 并记录map使用到的item 和index作用域
     */
    CallExpression: {
      enter: (path) => {
        if (isMapCallExpression(path.node)) {
          const scope = state.genMap(path)
          state.enterMap(path, scope)
        } else {
          state.genProp(path)
        }
      },
      exit: (path) => {
        if (isMapCallExpression(path.node)) {
          state.exitMap()
        }
      }
    },
    /**
     * a || b -> $data
     * a && b && <div></div> -> $data && <div></div>
     */
    LogicalExpression: {
      enter: (path) => {
        if (path.node.operator === '||') {
          state.genProp(path)
        } else {
          const left = path.get('left')
          state.genProp(left)
          const right = path.get('right')
          if (isData(right)) {
            state.genProp(right)
          }
        }
      }
    },
    ConditionalExpression: {
      enter: (path) => {
        const test = path.get('test')
        const alternate = path.get('alternate')
        const consequent = path.get('consequent')
        state.genProp(test)
        if (isData(alternate)) {
          state.genProp(alternate)
        }
        if (isData(consequent)) {
          state.genProp(consequent)
        }
      }
    },
    // jsxElement children下的 {data} -> {$data}
    JSXExpressionContainer: {
      enter: path => {
        if (path.parentPath.isJSXElement()) {
          const expression = path.get('expression')
          if (isData(expression)) {
            state.genProp(expression)
          }
        }
      }
    },
    JSXOpeningElement: {
      enter: path => {
        const name = path.get('name')
        const result: {
          origin?: string
          name?: string
        } = {}
        if (name.isJSXIdentifier()) {
          const originName = name.node.name
          const binding = name.scope.getBinding(originName)?.path
          if (binding?.isImportDefaultSpecifier()) {
            const parentPath = binding.parentPath
            if (parentPath.isImportDeclaration()) {
              const componentName = renameComponent(originName)
              result.name = componentName
              result.origin = originName
              state.addComponent(componentName, parentPath.node.source.value)
              name.replaceWith(
                t.jsxIdentifier(componentName)
              )
              if (!path.node.selfClosing) {
                const parent = path.parentPath
                if (parent.isJSXElement()) {
                  const closingElement = parent.get('closingElement') as NodePath<t.JSXClosingElement>
                  closingElement.get('name').replaceWith(
                    t.jsxIdentifier(componentName)
                  )
                }
              }
            }
          }
        }

        /**
         * 转换标签属性
         * attr={expression} -> attr={$data}
         * event={function} -> event={"$name"}
         */
        path.get('attributes').forEach(path => {
          if (path.isJSXAttribute()) {
            const value = path.get('value')
            if (value.isJSXExpressionContainer()) {
              const nameNode = path.node.name
              let name: string
              if (t.isJSXIdentifier(nameNode)) {
                name = nameNode.name
              } else {
                name = nameNode.namespace.name + ':' + nameNode.name.name
              }
              const expression = value.get('expression')
              if (/^(bind|catch|mut-bind|capture-bind|capture-catch)/.test(name) && expression.isFunction()) {
                // 事件
                const { scope, name } = state.genEvent(expression)
                if (scope && path.parentPath.isJSXOpeningElement()) {
                  path.parentPath.node.attributes.push(
                    t.jsxAttribute(
                      t.jsxIdentifier('data-' + name),
                      t.jSXExpressionContainer(scope)
                    )
                  )
                }
              } else {
                // 属性
                state.genProp(expression, result.name)
              }
            }
          }
        })
      }
    }
  })
}

function renameComponent(origin: string) {
  return origin.replace(/(.)([A-Z])/g, '$1-$2').toLowerCase()
}

function isData(path: NodePath<t.Node>) {
  return path.isBinaryExpression() || path.isMemberExpression() || path.isIdentifier() || path.isTemplateLiteral()
}

export function isMapCallExpression(node: t.CallExpression) {
  return t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.property) && node.callee.property.name === 'map'
}