import { iIdentifierItem } from "..";
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export default class EventIdentifier implements iIdentifierItem {
    private name;
    private path;
    private scope?;
    private value;
    constructor({ path, scope, name }: {
        path: NodePath<t.Node>;
        name: string;
        scope?: t.Expression;
    });
    restore(): void;
}
