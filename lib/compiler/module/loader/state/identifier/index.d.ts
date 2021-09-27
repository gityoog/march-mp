import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import MapScope from '../map-scope';
import PropIdentifier from './prop';
export interface iIdentifierItem {
    restore(): void;
}
export default class DependencyIdentifier {
    private scope;
    private prefix;
    private _id;
    private data;
    constructor(scope: MapScope);
    private genName;
    map(path: NodePath<t.CallExpression>): string[];
    prop(path: NodePath<t.Node>): PropIdentifier;
    event(path: NodePath<t.Node>): {
        scope: t.BinaryExpression | t.Identifier | undefined;
        name: string;
    };
    restore(): void;
    destroy(): void;
}
