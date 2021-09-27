import { NodePath } from "@babel/traverse"
import * as t from '@babel/types'

// 通过给顶层代码添加条件表达式保证第一个元素拥有wx:if="{{ p0 }}"作为初始化状态
export default function addReady(path: NodePath<t.Expression>) {
  if (path.isLogicalExpression()) {
    // a && <div></div> -> 不变
    // a || <div></div> -> (true && !a) && <div></div>
    if (path.node.operator === '||') {
      path.replaceWith(
        t.logicalExpression('&&', t.logicalExpression('&&', t.booleanLiteral(true),
          t.unaryExpression('!', path.node.left)), path.node.right)
      )
    }
  } else if (path.isConditionalExpression()) {
    // a ? <div></div> : <div></div> -> 不变
  } else {
    path.replaceWith(
      t.logicalExpression('&&', t.booleanLiteral(true), path.node)
    )
  }
}