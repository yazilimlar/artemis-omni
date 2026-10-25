/** ARTEMIS-FIN-001. Original, pure, no I/O; all amounts in integer cents. */
export type Money = number;
export type Posting = { account: string; debit: Money; credit: Money; currency: string };
export type Entity = { id: string; name: string; legalEntityId: string; kind: 'legal-entity'|'cost-center'|'property'|'individual'; taxClassification: 'unknown'|'disregarded'|'partnership'|'s-corp'|'c-corp'|'individual' };
export type Evidence = { id: string; kind: 'w2'|'1099'|'1098'|'receipt'|'invoice'|'tax-bill'|'return'|'statement'|'other'; entityId: string; taxYear: number; source: string; verified: boolean };
export type Payable = { id: string; entityId: string; amountCents: Money; paidCents: Money; dueDate: string|null; kind: 'invoice'|'accrual'|'property-tax'|'school-tax'|'credit-card'|'other'; evidenceIds: string[] };
function validCents(x: number): boolean { return Number.isSafeInteger(x) && x>=0; }
export function parseCents(value: string): Money {
  if(!/^-?\d+(\.\d{1,2})?$/.test(value)) throw new Error('Invalid USD amount');
  const negative=value.startsWith('-'); const [whole,fraction='']=(negative?value.slice(1):value).split('.');
  const n=Number(whole)*100+Number(fraction.padEnd(2,'0'));
  if(!Number.isSafeInteger(n)) throw new Error('Amount out of range');
  return negative?-n:n;
}
export function journalBalanced(lines: Posting[]): boolean {
  if(lines.length<2)return false;
  let debits=0,credits=0;const currencies=new Set<string>();
  for(const l of lines){
    if(!l.account||!l.currency||!validCents(l.debit)||!validCents(l.credit)||l.debit===l.credit)return false;
    currencies.add(l.currency);debits+=l.debit;credits+=l.credit;
    if(!Number.isSafeInteger(debits)||!Number.isSafeInteger(credits))return false;
  }
  return currencies.size===1&&debits===credits;
}
export function outstanding(p: Payable): Money {
  if(!validCents(p.amountCents)||!validCents(p.paidCents)||p.paidCents>p.amountCents)throw new Error('Invalid payable');
  return p.amountCents-p.paidCents;
}
export function accrualPosting(amountCents: Money,expenseAccount='operating_expense'): Posting[] {
  if(!validCents(amountCents)||amountCents===0)throw new Error('Invalid accrual');
  return [{account:expenseAccount,debit:amountCents,credit:0,currency:'USD'},{account:'accrued_liabilities',debit:0,credit:amountCents,currency:'USD'}];
}
export function cardPurchasePosting(amountCents: Money,expenseAccount='operating_expense'): Posting[] {
  if(!validCents(amountCents)||amountCents===0)throw new Error('Invalid purchase');
  return [{account:expenseAccount,debit:amountCents,credit:0,currency:'USD'},{account:'credit_card_payable',debit:0,credit:amountCents,currency:'USD'}];
}
export function cardPaymentPosting(amountCents: Money): Posting[] {
  if(!validCents(amountCents)||amountCents===0)throw new Error('Invalid payment');
  return [{account:'credit_card_payable',debit:amountCents,credit:0,currency:'USD'},{account:'operating_bank',debit:0,credit:amountCents,currency:'USD'}];
}
export function managementElimination(externalRevenue:Money,internalRevenue:Money,externalExpenses:Money,internalExpenses:Money){
  if([externalRevenue,internalRevenue,externalExpenses,internalExpenses].some(x=>!validCents(x)))throw new Error('Invalid amount');
  if(internalRevenue!==internalExpenses)throw new Error('Unmatched internal transfer; reconcile before eliminating');
  return {grossPresentedRevenue:externalRevenue+internalRevenue,eliminatedInternalRevenue:internalRevenue,consolidatedRevenue:externalRevenue,consolidatedExpenses:externalExpenses,operatingResult:externalRevenue-externalExpenses};
}
export function illustrativeProvision(profitCents:Money,effectiveRate:number){
  if(!Number.isSafeInteger(profitCents)||!Number.isFinite(effectiveRate)||effectiveRate<0||effectiveRate>1)throw new Error('Invalid scenario');
  return Math.round(Math.max(0,profitCents)*effectiveRate);
}
