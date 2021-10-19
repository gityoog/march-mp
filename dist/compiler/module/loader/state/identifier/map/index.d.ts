import { iIdentifierItem } from "..";
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export default class MapIdentifier implements iIdentifierItem {
    private name;
    private path;
    private calleeObject;
    private scope;
    private key?;
    constructor({ path, scope, name }: {
        path: NodePath<t.CallExpression>;
        name: string;
        scope: string[];
    });
    restore(): void;
}
