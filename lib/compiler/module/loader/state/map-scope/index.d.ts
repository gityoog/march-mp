import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export default class MapScope {
    private data;
    private dict;
    private push;
    enter(path: NodePath<t.CallExpression>, parent: string[]): void;
    exit(): void;
    private has;
    private getIndex;
    private update;
    getScope(path: NodePath): string[];
    destroy(): void;
}
