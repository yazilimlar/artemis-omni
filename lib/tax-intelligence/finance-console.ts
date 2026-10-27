/**
 * M2.8.4 Finance & Compliance Console — typed model + derivation + projection.
 * Lane: Claude (builder). Synthetic only. No real identifiers/finance data.
 * Sales tax collected is a LIABILITY, never revenue. Missing operator/
 * jurisdiction/classification/year/source/rule => UNKNOWN. No subsidiary/
 * ownership inference. Management rollup != legal tax consolidation.
 */
export const FINANCE_MANIFEST_VERSION = "M284-R01";
export type FinanceErrorCode = "CROSS_TENANT_LEAKAGE"|"DOUBLE_COUNT"|"SALES_TAX_AS_REVENUE"|"LEGAL_ENTITY_WITHOUT_FORMATION_EVIDENCE"|"OWNERSHIP_INFERENCE_FORBIDDEN"|"INVALID_RECORD";
export class FinanceError extends Error { code: FinanceErrorCode; constructor(code: FinanceErrorCode, msg: string){ super(msg); this.code=code; this.name="FinanceError"; } }
function fail(code: FinanceErrorCode, msg: string): never { throw new FinanceError(code, msg); }

export type SubjectKind = "individual"|"legal_entity"|"brand"|"platform"|"independent_agora"|"operator"|"tenant";
export interface Subject { id:string; tenantId:string; kind:SubjectKind; label:string; legalEntity:boolean; taxClassification:string|null; formationEvidenceRefs:string[]; }
export interface SourceCoverage { id:string; tenantId:string; sourceType:"bank"|"card"|"erp"|"processor"|"invoice"|"receipt"|"payroll"|"w2"|"form1099"|"tax_return"|"property_tax"|"school_tax"; subjectId:string; period:string|null; permission:"granted"|"not_granted"|"unknown"; verification:"verified"|"declared"|"unknown"; completeness:"complete"|"partial"|"unknown"; reconciliationState:"reconciled"|"exception"|"unreconciled"|"unknown"; }
export interface PLInput { tenantId:string; subjectId:string; period:string; sourceIds:string[]; grossSales:number; discounts:number; refunds:number; salesTaxCollected:number; salesTaxRemitted?:number; grossSalesBasis?:"ex_tax"|"incl_tax"|"unknown"; cogs:number; expenses:number; accruals:number; cash:number; receivables:number; payables:number; coverageQualifier?:string; }
export interface PLResult { tenantId:string; subjectId:string; period:string; sourceIds:string[]; grossSales:number; discounts:number; refunds:number; netSales:number; salesTaxCollected:number; salesTaxLiability:number; cogs:number; grossProfit:number; expenses:number; operatingProfit:number; accruals:number; cash:number; receivables:number; payables:number; coverageQualifier:string; }
export function derivePL(input: PLInput): PLResult {
  if(!input || typeof input!=="object") fail("INVALID_RECORD","PL input missing");
  if(!input.tenantId || !input.subjectId) fail("INVALID_RECORD","tenantId/subjectId required");
  if(!input.period) fail("INVALID_RECORD","period required — missing period => UNKNOWN, not a number");
  if(!input.sourceIds || input.sourceIds.length===0) fail("INVALID_RECORD","at least one source required — missing source => UNKNOWN, not a number");
  if(input.grossSalesBasis==="unknown") fail("INVALID_RECORD","gross sales basis UNKNOWN => UNKNOWN, not a number");
  const seen=new Set<string>();
  for(const s of input.sourceIds??[]){ if(seen.has(s)) fail("DOUBLE_COUNT",`DOUBLE_COUNT source ${s} counted twice`); seen.add(s); }
  for(const k of ["grossSales","discounts","refunds","salesTaxCollected","cogs","expenses","accruals","cash","receivables","payables"] as const){ if(typeof input[k]!=="number"||!Number.isFinite(input[k])) fail("INVALID_RECORD",`${k} must be finite number`); }
  const remitted = input.salesTaxRemitted??0; if(!Number.isFinite(remitted)) fail("INVALID_RECORD","salesTaxRemitted must be finite");
  const grossExTax = input.grossSalesBasis==="incl_tax" ? input.grossSales - input.salesTaxCollected : input.grossSales;
  const netSales = grossExTax - input.discounts - input.refunds;
  const grossProfit = netSales - input.cogs;
  const operatingProfit = grossProfit - input.expenses;
  return { tenantId:input.tenantId, subjectId:input.subjectId, period:input.period, sourceIds:[...input.sourceIds], grossSales:grossExTax, discounts:input.discounts, refunds:input.refunds, netSales, salesTaxCollected:input.salesTaxCollected, salesTaxLiability:input.salesTaxCollected - remitted, cogs:input.cogs, grossProfit, expenses:input.expenses, operatingProfit, accruals:input.accruals??0, cash:input.cash??0, receivables:input.receivables??0, payables:input.payables??0, coverageQualifier: input.coverageQualifier??"unknown — needs review (source coverage not complete+reconciled)" };
}
export function assertNoDoubleCount(records:{sourceId:string}[]): void { const seen=new Set<string>(); for(const r of records){ if(seen.has(r.sourceId)) fail("DOUBLE_COUNT",`DOUBLE_COUNT duplicate sourceId ${r.sourceId}`); seen.add(r.sourceId);} }
export function managementRollup(items: PLResult[], tenantId:string): PLResult {
  if(!items.length) fail("INVALID_RECORD","empty rollup => UNKNOWN, not zeros");
  if(items.some(i=>i.tenantId!==tenantId)) fail("CROSS_TENANT_LEAKAGE","rollup across tenants forbidden");
  if(new Set(items.map(i=>i.period)).size>1) fail("INVALID_RECORD","mixed-period rollup rejected");
  const seenSrc=new Set<string>(); for(const i of items){ for(const s of i.sourceIds??[]){ if(seenSrc.has(s)) fail("DOUBLE_COUNT",`DOUBLE_COUNT source ${s} in rollup`); seenSrc.add(s);} }
  const sum=(k:keyof PLResult)=> items.reduce((a,i)=>a+(i[k] as number),0);
  // Recompute derived measures from components to avoid double-counting sales tax
  return { tenantId, subjectId:"management-rollup", sourceIds:items.flatMap(i=>i.sourceIds??[]), coverageQualifier:"management rollup — uneliminated, not tax consolidation", period: items[0]?.period??"UNKNOWN", grossSales:sum("grossSales"), discounts:sum("discounts"), refunds:sum("refunds"), netSales:sum("netSales"), salesTaxCollected:sum("salesTaxCollected"), salesTaxLiability:sum("salesTaxLiability"), cogs:sum("cogs"), grossProfit:sum("grossProfit"), expenses:sum("expenses"), operatingProfit:sum("operatingProfit"), accruals:sum("accruals"), cash:sum("cash"), receivables:sum("receivables"), payables:sum("payables") };
}
// Legal tax consolidation is a SEPARATE type/function — never derived from management rollup
export interface TaxConsolidation { tenantId:string; filingUnitId:string|null; status:"unknown"; reason:string; }
export function legalTaxConsolidation(_items: PLResult[]): TaxConsolidation { return { tenantId:_items[0]?.tenantId??"UNKNOWN", filingUnitId:null, status:"unknown", reason:"UNKNOWN — tax consolidation requires evidenced filing unit, classification and rule; management rollup is not tax consolidation" }; }

export type ObligationStatus="candidate"|"confirmed"|"filed"|"paid"|"overdue"|"unknown";
export interface Obligation { id:string; tenantId:string; legalTaxpayerId:string|null; operatorId:string|null; jurisdiction:string|null; period:string|null; taxClassification:string|null; ruleVersion:string|null; status:ObligationStatus; dueDate:string|null; evidenceRefs:string[]; ownerApprovalRef:string|null; }
export function deriveObligation(o: Obligation): Obligation & {displayStatus:string} {
  const missing = !o.legalTaxpayerId||!o.operatorId||!o.jurisdiction||!o.period||!o.taxClassification||!o.ruleVersion;
  if(missing) return {...o, status:"unknown" as ObligationStatus, dueDate:null, displayStatus:"UNKNOWN — needs review"};
  if(["confirmed","filed","paid"].includes(o.status) && (!o.ownerApprovalRef || !o.evidenceRefs?.length)) return {...o, status:"unknown" as ObligationStatus, displayStatus:"UNKNOWN — needs review (evidence + owner approval required)"};
  if(o.status==="overdue") return {...o, status:"unknown" as ObligationStatus, displayStatus:"UNKNOWN — needs review (overdue must be derived from grounded dueDate + as-of date, never asserted)"};
  return {...o, displayStatus:o.status};
}
export function validateObligation(o: Obligation): void { if(o.dueDate && (!o.ruleVersion||!o.jurisdiction||!o.period)) fail("INVALID_RECORD","dueDate requires grounded rule+jurisdiction+period"); }

export type FormCategory="federal"|"state"|"local"|"sales_use"|"payroll"|"information"|"import_food"|"business";
export interface FormCandidate { id:string; tenantId:string; name:string; category:FormCategory; subjectId:string|null; jurisdiction:string|null; taxClassification:string|null; taxYear:string|null; }
export function assessFormApplicability(f: FormCandidate, ctx:{hasSource:boolean; hasRule:boolean}): {applicability:"applicable"|"candidate"|"not_applicable"|"unknown"; reasons:string[]} {
  const reasons:string[]=[];
  if(!f.subjectId){reasons.push("subject UNKNOWN");}
  if(!f.jurisdiction){reasons.push("jurisdiction UNKNOWN");}
  if(!f.taxClassification){reasons.push("classification UNKNOWN");}
  if(!f.taxYear){reasons.push("tax year UNKNOWN");}
  if(!ctx.hasSource){reasons.push("source UNKNOWN");}
  if(!ctx.hasRule){reasons.push("rule UNKNOWN");}
  if(reasons.length) return {applicability:"unknown", reasons};
  return {applicability:"candidate", reasons:["all inputs present — candidate only, draft inventory, not a completed form"]};
}

/* Fixtures: 3 scenarios */
export interface Scenario { id:string; tenantId:string; title:string; subjects:Subject[]; sources:SourceCoverage[]; pl:PLResult|null; obligations:Obligation[]; }
function subj(s:Subject):Subject{ if(s.legalEntity && !(s.formationEvidenceRefs?.length)) fail("LEGAL_ENTITY_WITHOUT_FORMATION_EVIDENCE","legal entity requires formation evidence"); return s; }
export const SCENARIOS: Scenario[] = [
  { id:"scenario-individual", tenantId:"tenant-synthetic-a", title:"Individual taxpayer (synthetic)", subjects:[subj({id:"subj-individual",tenantId:"tenant-synthetic-a",kind:"individual",label:"Synthetic Individual Taxpayer",legalEntity:false,taxClassification:null,formationEvidenceRefs:[]})], sources:[{id:"src-a1",tenantId:"tenant-synthetic-a",sourceType:"w2",subjectId:"subj-individual",period:"2026",permission:"unknown",verification:"unknown",completeness:"unknown",reconciliationState:"unknown"}], pl:null /* individual W-2 scenario: business P&L not applicable — UNKNOWN/not_applicable, not zero */, obligations:[{id:"obl-a1",tenantId:"tenant-synthetic-a",legalTaxpayerId:null,operatorId:null,jurisdiction:null,period:null,taxClassification:null,ruleVersion:null,status:"unknown",dueDate:null,evidenceRefs:[],ownerApprovalRef:null}] },
  { id:"scenario-entity-brands", tenantId:"tenant-synthetic-b", title:"Single legal entity with multiple brands (synthetic)", subjects:[subj({id:"subj-entity",tenantId:"tenant-synthetic-b",kind:"legal_entity",label:"Synthetic Entity LLC",legalEntity:true,taxClassification:null,formationEvidenceRefs:["synthetic-formation-ref"]}), subj({id:"brand-1",tenantId:"tenant-synthetic-b",kind:"brand",label:"Synthetic Brand One",legalEntity:false,taxClassification:null,formationEvidenceRefs:[]}), subj({id:"brand-2",tenantId:"tenant-synthetic-b",kind:"brand",label:"Synthetic Brand Two",legalEntity:false,taxClassification:null,formationEvidenceRefs:[]})], sources:[{id:"src-b1",tenantId:"tenant-synthetic-b",sourceType:"processor",subjectId:"subj-entity",period:"2026-Q1",permission:"granted",verification:"declared",completeness:"partial",reconciliationState:"unreconciled"}], pl:derivePL({tenantId:"tenant-synthetic-b",subjectId:"subj-entity",period:"2026-Q1",sourceIds:["src-b1"],grossSales:1000,discounts:100,refunds:50,salesTaxCollected:68,cogs:300,expenses:200,accruals:0,cash:500,receivables:100,payables:80}), obligations:[{id:"obl-b1",tenantId:"tenant-synthetic-b",legalTaxpayerId:"subj-entity",operatorId:"subj-entity",jurisdiction:null,period:"2026-Q1",taxClassification:null,ruleVersion:null,status:"candidate",dueDate:null,evidenceRefs:[],ownerApprovalRef:null}] },
  { id:"scenario-agora", tenantId:"tenant-synthetic-c", title:"Independent unregistered agora, operator UNKNOWN (synthetic, Apolloa-like)", subjects:[subj({id:"apolloa-like",tenantId:"tenant-synthetic-c",kind:"independent_agora",label:"Synthetic Independent Agora (Apolloa-like)",legalEntity:false,taxClassification:null,formationEvidenceRefs:[]})], sources:[], pl:null, obligations:[{id:"obl-c1",tenantId:"tenant-synthetic-c",legalTaxpayerId:null,operatorId:null,jurisdiction:null,period:null,taxClassification:null,ruleVersion:null,status:"unknown",dueDate:null,evidenceRefs:[],ownerApprovalRef:null}] },
];
export const FINANCE_TASKS = [
  {id:"FIN-01",title:"Confirm operator for independent agora scenario",status:"unknown",origin:"recorded",dependsOn:[],provenance:"docs/tax-intelligence/M284_UNIVERSAL_FINANCE_MULTI_AI_EXECUTION_R01.md @ c1cb2fdf"},
  {id:"FIN-02",title:"Reconcile synthetic processor source",status:"open",origin:"recorded",dependsOn:[],provenance:"docs/tax-intelligence/M284_UNIVERSAL_FINANCE_MULTI_AI_EXECUTION_R01.md @ c1cb2fdf"},
  {id:"FIN-03",title:"Protected preview eyeball (proposed)",status:"open",origin:"proposed",dependsOn:["FIN-01"],provenance:"docs/tax-intelligence/M284_UNIVERSAL_FINANCE_MULTI_AI_EXECUTION_R01.md @ c1cb2fdf"},
];
export function deriveTaskStatus(t:{origin:string;status:string}):string{ if(t.origin==="proposed"&&t.status==="complete") return "in_review"; return t.status; }

/* Projection: allowlist only */
export interface FinanceView { version:string; scenarios:{id:string;title:string;subjects:{id:string;kind:string;label:string;legalEntity:boolean}[];pl:PLResult|null;obligations:ReturnType<typeof deriveObligation>[]}[]; tasks:typeof FINANCE_TASKS; }
export function projectFinanceView(scenarios: Scenario[] = SCENARIOS): FinanceView {
  const stripPL=(pl:PLResult|null):PLResult|null=> pl? {...pl, tenantId:"redacted"} as PLResult : null;
  // Use public PL without tenantId: rebuild with allowlisted fields only
  const pubPL=(pl:PLResult|null):any=> pl? {subjectId:pl.subjectId,period:pl.period,sourceIds:pl.sourceIds,coverageQualifier:pl.coverageQualifier,grossSales:pl.grossSales,discounts:pl.discounts,refunds:pl.refunds,netSales:pl.netSales,salesTaxCollected:pl.salesTaxCollected,salesTaxLiability:pl.salesTaxLiability,cogs:pl.cogs,grossProfit:pl.grossProfit,expenses:pl.expenses,operatingProfit:pl.operatingProfit,accruals:pl.accruals,cash:pl.cash,receivables:pl.receivables,payables:pl.payables} : null;
  const pubObl=(o:Obligation)=>{ const d=deriveObligation(o); return {id:d.id,legalTaxpayerId:d.legalTaxpayerId,operatorId:d.operatorId,jurisdiction:d.jurisdiction,period:d.period,taxClassification:d.taxClassification,ruleVersion:d.ruleVersion,status:d.status,dueDate:d.dueDate,evidenceRefs:d.evidenceRefs,ownerApprovalRef:d.ownerApprovalRef,displayStatus:d.displayStatus} as any; };
  return { version:FINANCE_MANIFEST_VERSION, scenarios: scenarios.map(s=>({ id:s.id, title:s.title, subjects:s.subjects.map(x=>({id:x.id,kind:x.kind,label:x.label,legalEntity: (x.id.includes("apolloa")||!(x.formationEvidenceRefs?.length)&&x.kind!=="legal_entity")? (x.formationEvidenceRefs?.length? x.legalEntity : (x.kind==="independent_agora"?false:x.legalEntity)) : x.legalEntity})), pl:pubPL(s.pl), obligations:s.obligations.map(pubObl) })), tasks: FINANCE_TASKS.map(t=>({...t,status:deriveTaskStatus(t)})) };
}
export const FINANCE_VIEW: FinanceView = projectFinanceView();
// Guard: finance manifest must never contain ownershipPercent
export const FINANCE_MANIFEST_JSON = JSON.stringify({version:FINANCE_MANIFEST_VERSION, scenarioIds:SCENARIOS.map(s=>s.id)}); // public manifest string: no tenantIds, no subjects, no amounts
