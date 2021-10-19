import { NodePath } from "@babel/traverse";
import * as t from '@babel/types';
export default function getProperties(path: NodePath<t.ClassDeclaration>): t.ObjectProperty[];
