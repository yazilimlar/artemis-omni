import {describe,it,expect} from 'vitest';
import {parseCents,journalBalanced,accrualPosting,cardPurchasePosting,cardPaymentPosting,outstanding,managementElimination,illustrativeProvision} from './universal-kernel';
describe('ARTEMIS FIN-001 accounting invariants',()=>{
 it('parses exact cents',()=>{expect(parseCents('125.50')).toBe(12550);expect(()=>parseCents('1.234')).toThrow()});
 it('balances accrual and card journal',()=>{expect(journalBalanced(accrualPosting(1000))).toBe(true);expect(journalBalanced(cardPurchasePosting(12550))).toBe(true);expect(journalBalanced(cardPaymentPosting(12550))).toBe(true)});
 it('does not treat card payment as expense',()=>{expect(cardPaymentPosting(500)[0].account).toBe('credit_card_payable')});
 it('calculates outstanding balances',()=>{expect(outstanding({id:'x',entityId:'a',amountCents:1000,paidCents:250,dueDate:null,kind:'invoice',evidenceIds:[]})).toBe(750)});
 it('eliminates matched inter-cost-center amounts',()=>{expect(managementElimination(10000,2000,6000,2000).operatingResult).toBe(4000);expect(()=>managementElimination(10000,2000,6000,1000)).toThrow()});
 it('models but does not file tax',()=>{expect(illustrativeProvision(10000,.25)).toBe(2500)});
});
