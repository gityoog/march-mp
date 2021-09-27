import { NodePath } from "@babel/traverse";
import * as t from '@babel/types';
import State from "../../state";
export default function genData(path: NodePath<t.Expression>, state: State): void;
export declare function isMapCallExpression(node: t.CallExpression): boolean;
