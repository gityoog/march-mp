import { iIdentifierItem } from "..";
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export default class PropIdentifier implements iIdentifierItem {
    private name;
    private path;
    private scope;
    private value;
    private native;
    constructor({ path, scope, name }: {
        path: NodePath<t.Node>;
        name: string;
        scope: string[];
    });
    setNative(): void;
    restore(): void;
}
