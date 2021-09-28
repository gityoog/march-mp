import ts from 'typescript';
export default class FixThisState {
    private _identifier?;
    get identifier(): ts.Identifier;
    isChanged(): boolean;
    private arrowCount;
    isInArrow(): boolean;
    enterArrow(): void;
    leaveArrow(): void;
    private data;
    add(node: ts.Node): void;
    private getLast;
    private removeLast;
    isActived(): boolean;
    active(node: ts.Node): void;
    leave(node: ts.Node): void;
    log(): void;
}
