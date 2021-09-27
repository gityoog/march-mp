import { NodePath } from "@babel/traverse";
import DependencyIdentifier from "./identifier";
import MapScope from "./map-scope";
import * as t from '@babel/types';
import PropIdentifier from "./identifier/prop";
export default class State {
    debug: boolean;
    constructor(filename: string);
    json: any;
    cssfile: string[];
    wxml: string;
    setWXML(value: string): void;
    setJSON(value: any): void;
    addCss(file: string): void;
    components: Record<string, {
        path: string;
        props: PropIdentifier[];
    }>;
    addComponent(name: string, path: string): void;
    setComponentNative(name: string): void;
    private callbacks;
    before(callback: () => void): void;
    private generator?;
    setGenerator(generator: () => string): void;
    generate(): string;
    events: string[];
    addEvent(name: string): void;
    mapScope: MapScope;
    identifier: DependencyIdentifier;
    enterMap(path: NodePath<t.CallExpression>, scope: string[]): void;
    exitMap(): void;
    genMap(path: NodePath<t.CallExpression>): string[];
    genProp(path: NodePath<t.Node>, component?: string): void;
    genEvent(path: NodePath<t.Node>): {
        scope: t.BinaryExpression | t.Identifier | undefined;
        name: string;
    };
    destroy(): void;
}
