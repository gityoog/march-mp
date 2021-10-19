import * as t from '@babel/types';
export declare function mergeMember(identifier: t.Identifier, indexs: string[]): t.Identifier | t.MemberExpression;
export declare function genExpression(indexs: string[]): t.BinaryExpression | t.Identifier | undefined;
export declare const fnName: {
    prop: string;
    event: string;
};
export declare function genPropCall(value: t.Expression, name: t.StringLiteral | t.ArrayExpression, native?: boolean): t.CallExpression;
export declare function genEventCall(value: t.Expression, name: t.StringLiteral | t.ArrayExpression): t.CallExpression;
