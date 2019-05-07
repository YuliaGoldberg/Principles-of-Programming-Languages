import { map, zipWith } from "ramda";
import { CExp, Parsed, PrimOp, AppExp, LitExp, isBoolExp, isNumExp, isVarRef, isVarDecl, makeNumExp,DefineExp,LetExp, isBinding } from "./imp/L3-ast";
import { makeAppExp, makeDefineExp, makeIfExp, makeProcExp, makeProgram, makePrimOp, makeLetExp, makeBinding, makeLitExp,parseL3Sexp} from "./imp/L3-ast";
import { isAppExp, isAtomicExp, isCExp, isDefineExp, isIfExp, isLetExp, isLitExp, isPrimOp, isProcExp, isProgram } from "./imp/L3-ast";
import {isError} from './imp/error';
import { makeEmptySExp, isEmptySExp, isCompoundSExp, CompoundSExp,SExp, isSymbolSExp } from "./imp/L3-value";
import {first, second, rest} from './imp/list';
  


export type Exp = DefineExp | CExp;
export const isExp = (x:any): x is Exp => isDefineExp(x) || isCExp(x);
export interface Binding {tag: "Binding"; var: VarDecl; val: CExp; };
export interface VarDecl {tag: "VarDecl"; var: string; };


/*
Purpose: convert L3 AST to L30 AST
Signature: l3ToL30(exp)
Type: (Parsed | Error) => Parsed | Error
*/
export const l3ToL30 = (exp: Parsed | Error): Parsed | Error  =>
isError(exp) ? exp :
    isExp(exp) ? rewriteAllListExp(exp) :
    isProgram(exp) ? makeProgram(map(rewriteAllListExp, exp.exps)) :
    exp;

export const rewriteAllListExp = (exp: Exp): Exp =>
    isCExp(exp) ? rewriteAllListCExp(exp) :
    isDefineExp(exp) ? makeDefineExp(exp.var, rewriteAllListCExp(exp.val)) :
    exp;

export const rewriteAllListCExp = (exp: CExp): CExp =>
    isAtomicExp(exp) ? exp :
    (isLitExp(exp) && isCompoundSExp(exp.val)) ? handleLitExp(exp):
    isLitExp(exp) ?  exp :
    isIfExp(exp) ? makeIfExp(rewriteAllListCExp(exp.test),
                             rewriteAllListCExp(exp.then),
                             rewriteAllListCExp(exp.alt)) :
    (isAppExp(exp) && isPrimOp(exp.rator) && (exp.rator.op === "list")) ?
        handleList(exp) :
    isAppExp(exp) ?
        makeAppExp(rewriteAllListCExp(exp.rator),map(rewriteAllListCExp, exp.rands)):
    isProcExp(exp) ? makeProcExp(exp.args, map(rewriteAllListCExp, exp.body)) :
    isLetExp(exp) ? makeLetExp(map(x => ({tag: "Binding", var: x.var, val:rewriteAllListCExp(x.val)}),exp.bindings),map(rewriteAllListCExp,exp.body)) :
    isVarDecl(exp) ? exp :
    exp;


export const handleList = (exp : AppExp): AppExp|LitExp =>
    (exp.rands.length === 0) ?
        makeLitExp(makeEmptySExp()):
    (exp.rands.length === 1) ?
        makeAppExp(makePrimOp("cons"),[rewriteAllListCExp(exp.rands[0]),makeLitExp(makeEmptySExp())]):
        makeAppExp(makePrimOp("cons"),[rewriteAllListCExp(exp.rands[0]),handleList(makeAppExp(exp.rator,exp.rands.slice(1)))]);
 
export const isQuote = (str : string): boolean => str === "quote" 

export const handleLitExp = (exp : LitExp): AppExp|LitExp =>
isEmptySExp(exp.val) ? makeLitExp(makeEmptySExp()) : 
(isCompoundSExp(exp.val) && isSymbolSExp(exp.val.val1) && isQuote(exp.val.val1.val)  && isCompoundSExp(exp.val.val2)) ?
handleLitExp(makeLitExp(exp.val.val2.val1)) :
isCompoundSExp(exp.val) ?
makeAppExp(makePrimOp("cons"),[handleLitExp(makeLitExp(exp.val.val1)),handleLitExp(makeLitExp(exp.val.val2))]) : exp ;



