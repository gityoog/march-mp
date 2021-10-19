import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export default function getWXML(path: NodePath<t.Expression>): t.Expression | t.JSXEmptyExpression;
