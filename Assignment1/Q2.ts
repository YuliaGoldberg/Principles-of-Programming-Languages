// Q2.1
export interface NumberTree {
    root: number;
    children: NumberTree[];
}

export const sumTreeIf:(tree : NumberTree, foo:((x:number)=>boolean)) => number = 
function (tree : NumberTree, foo:((x:number)=>boolean)):number{
    return (tree.children.map(x => sumTreeIf(x,foo)).reduce((acc, cur) => acc + cur, 0)
    + (foo(tree.root) ? tree.root : 0));
}

// Q2.2
export interface WordTree {
    root: string;
    children: WordTree[];
}

export const sentenceFromTree:(tree : WordTree) => string =
function sentenceFromTree(tree : WordTree){
    return tree.root + " " + (tree.children.map(x => sentenceFromTree(x))).reduce((acc,cur) => acc + cur,"");
}

// Q2.3
export interface Grade {
    course: string;
    grade: number;
}

export interface Student {
    name: string;
    gender: string;
    grades: Grade[];
}

export interface SchoolClass {
    classNumber: number;
    students: Student[];
}

// Q2.3.1
type School = SchoolClass[];
export const hasSomeoneFailedBiology:(school : School) => boolean =
function hasSomeoneFailedBiology(school : School){
    return school.map(x => x.students).reduce((acc,cur) => acc.concat(cur),[]).map(x => x.grades).
    reduce((acc,cur) => acc.concat(cur),[]).map(x => (((x.course === "biology") && (x.grade < 56)) ? true : false)).
    reduce((acc,cur) => acc || cur, false);
}

// Q2.3.2
export const allGirlsPassMath:(school : School) => boolean =
function allGirlsPassMath(school : School){
    return school.map(x => x.students).reduce((acc,cur) => acc.concat(cur),[]).filter(x => x.gender === "Female").
    map(x => x.grades).reduce((acc,cur) => acc.concat(cur),[]).filter(x => x.course === "math").map(x =>((x.grade >= 56)) ? true : false).
    reduce((acc,cur) => acc && cur, true);
}


// Q2.4
export interface YMDDate {
    year: number;
    month: number;
    day: number;
}

export const comesBefore: (date1: YMDDate, date2: YMDDate) => boolean = (date1, date2) => {
    if (date1.year < date2.year) {
        return true;
    }
    if (date1.year === date2.year && date1.month < date2.month) {
        return true;
    }
    if (date1.year === date2.year && date1.month === date2.month && date1.day < date2.day) {
        return true;
    }
    return false;
}

type PaymentMethod = Wallet | DebitCard | Cash;

export interface Cash{
    tag: "cash";
    amount: number;
}

const makeCash = (amount: number): Cash =>
({tag: "cash", amount: amount});

const isCash = (x: any): x is Cash => x.tag === "cash";

export interface DebitCard{
    tag: "dc"
    expirationDate: YMDDate;
    amount: number;
}

const makeDebitCard = (amount: number, expirationDate: YMDDate): DebitCard =>
({tag: "dc",amount: amount, expirationDate:expirationDate});

const isDebitCard = (x: any): x is DebitCard => x.tag === "dc";

export interface Wallet{
    tag: "wallet";
    paymentMethods: PaymentMethod[];
}

const makeWallet = (paymentMethods: PaymentMethod[]): Wallet =>
({tag: "wallet",paymentMethods: paymentMethods});

const isWallet = (x: any): x is Wallet => x.tag === "wallet";

export interface ChargeResult {
    amountLeft: number;
    wallet: Wallet;
}

const makeChargeResult = (amountLeft:number,wallet:Wallet):ChargeResult =>
({amountLeft:amountLeft,wallet:wallet});

export const combineChargeResult:(charge1:ChargeResult, charge2:ChargeResult)=>ChargeResult=
function combineChargeResult(charge1:ChargeResult, charge2:ChargeResult){
    return {amountLeft:charge2.amountLeft, wallet:makeWallet(charge1.wallet.paymentMethods.concat(charge2.wallet.paymentMethods))};
}

export const charge:(paymentMethod: PaymentMethod,amount: number, date: YMDDate) => ChargeResult=
function charge(paymentMethod: PaymentMethod,amount: number, date: YMDDate){
    return isCash(paymentMethod) ? 
            amount <= paymentMethod.amount ?
            {amountLeft: 0,wallet: makeWallet([makeCash(paymentMethod.amount-amount)])}: {amountLeft: amount-paymentMethod.amount,wallet: makeWallet([makeCash(0)])}
        :isDebitCard(paymentMethod) ?
            comesBefore(date, paymentMethod.expirationDate)?    
                amount <= paymentMethod.amount ?
                    {amountLeft:0, wallet: makeWallet([makeDebitCard(paymentMethod.amount-amount,paymentMethod.expirationDate)])}: {amountLeft:amount-paymentMethod.amount,wallet:makeWallet([makeDebitCard(0,paymentMethod.expirationDate)])}:
                {amountLeft: amount ,wallet: makeWallet([makeDebitCard(paymentMethod.amount,paymentMethod.expirationDate)])}:
        isWallet(paymentMethod)? 
        paymentMethod.paymentMethods.reduce((acc,curr) => combineChargeResult(acc, charge(curr,acc.amountLeft, date)),makeChargeResult(amount,makeWallet([]))):
        makeChargeResult(amount, makeWallet([]));    
}

