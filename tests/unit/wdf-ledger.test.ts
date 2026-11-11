import {describe,it,expect} from 'vitest';
import {createLedger, assessEligibility} from '../../public/standalone/bid-radar-wdf-01/ledger-model.mjs';
import {deadlineStatus, deadlineMarkup} from '../../public/standalone/bid-radar-wdf-01/deadline-status.mjs';
import fs from 'node:fs';
import vm from 'node:vm';
const NOW='2026-11-11T15:00:00Z';
const values={value:10,margin:10,months:10,risk:0,capital:0,rate:0,win:50,bid:0,confidence:100,capacity:100};
const source={dataset:'test-public',fetchedAt:NOW};
const record={id:'A',title:'SYNTHETIC test notice',agency:'Test agency',pin:'REUSED',due:'2026-11-12T15:00:00Z',rawSource:{request_id:'A',description:{clauses:['original']}}};
function setup(){const ledger=createLedger({now:()=>NOW});ledger.observe([record],source);const pkg=ledger.read().packages[0];const p=ledger.createPursuit({packageId:pkg.id,role:'prime',label:'SYNTHETIC prime'});ledger.updateScenario(p.id,{values,origin:'Synthetic test',asOf:NOW,scenarioName:'Base test'});return {ledger,p,pkg};}
describe('WDF public/test decision ledger',()=>{
 it('retains repeated PINs and versions without merging project or package identity',()=>{
  const {ledger}=setup();ledger.observe([{...record,id:'B',title:'Amendment'}, {...record,id:'C',title:'Cancellation'}],source);
  expect(ledger.read().notices).toHaveLength(3);expect(ledger.read().packages).toHaveLength(3);
  ledger.observe([{...record,title:'Changed',due:'2026-11-13T15:00:00Z'}],source);
  const s=ledger.read();expect(s.notices[0].versions).toHaveLength(2);expect(s.notices[0].versions[0].facts.title).toBe(record.title);
  ledger.observe([],source);expect(ledger.read().notices).toHaveLength(3);
 });
 it('is idempotent for identical facts and namespaces notice IDs by dataset',()=>{
  const {ledger}=setup();ledger.observe([record],{...source,fetchedAt:'2026-11-11T16:00:00Z'});expect(ledger.read().notices[0].versions).toHaveLength(1);
  ledger.observe([record],{...source,dataset:'different'});expect(ledger.read().notices).toHaveLength(2);
 });
 it('keeps independent roles and alternatives, never aggregates their financials',()=>{
  const {ledger,p,pkg}=setup();const sub=ledger.createPursuit({packageId:pkg.id,role:'subcontract',label:'SYNTHETIC subcontract'});
  ledger.updateScenario(sub.id,{values:{...values,value:2},origin:'Synthetic sub test',asOf:NOW,scenarioName:'Sub alternative'});
  expect(ledger.read().pursuits.find((x:{id:string})=>x.id===p.id)!.assumptions.value.value).toBe(10);
  expect(ledger.read().pursuits.find((x:{id:string})=>x.id===sub.id)!.assumptions.value.value).toBe(2);
  expect(ledger.export()).not.toHaveProperty('total');expect(ledger.read().packages[0]).not.toHaveProperty('value');
 });
 it('deep-copies input source facts, nested evidence and returned state',()=>{
  const {ledger,p}=setup();const evidence={reference:'SYNTHETIC §1',url:'https://example.com/public'};
  ledger.setEligibility(p.id,{requirement:'Attendance',state:'pass',reviewer:'Test reviewer',assessedAt:NOW,evidence});
  evidence.reference='changed outside';const state=ledger.read();
  expect(()=>{state.pursuits[0].eligibility[0].evidence.reference='mutation';}).toThrow();
  expect(state.pursuits[0].eligibility[0].evidence.reference).toBe('SYNTHETIC §1');
  const raw={...record,rawSource:{request_id:'A',description:{clauses:['new']}}};ledger.observe([raw],source);raw.rawSource.description.clauses[0]='mutated';
  expect(ledger.read().notices[0].versions.at(-1)!.facts.rawSource.description.clauses[0]).toBe('new');
 });
 it('freezes decision-time source, assumptions, eligibility and model while later work changes',()=>{
  const {ledger,p}=setup();const entry=ledger.setEligibility(p.id,{requirement:'Attendance',state:'unknown',reviewer:'Test reviewer',assessedAt:NOW,evidence:{reference:'Missing public proof'}});
  const snap=ledger.decision(p.id,{decision:'Needs evidence',reviewer:'Test lead',rationale:'Attendance unknown'});const before=JSON.stringify(snap);
  ledger.updateScenario(p.id,{values:{...values,value:20},origin:'Synthetic revision',asOf:NOW,scenarioName:'Revision'});
  ledger.setEligibility(p.id,{...entry,state:'pass',evidence:{reference:'SYNTHETIC proof'}});
  ledger.observe([{...record,title:'Cancelled'}],source);
  ledger.outcome(p.id,{status:'Cancelled',reviewer:'Test lead',evidence:'Test outcome',decisionId:snap.id});
  expect(JSON.stringify(snap)).toBe(before);expect(snap.financialModel.result!.velocity).toBe(100000);expect(snap.resolutionTasks).toHaveLength(1);
  const second=ledger.decision(p.id,{decision:'Do not pursue',reviewer:'Test lead',rationale:'Test cancellation'});
  expect(second.financialModel.result!.velocity).toBe(200000);expect(second.noticeVersionsAvailable[0].versions).toHaveLength(2);
  expect(snap).not.toHaveProperty('outcomes');expect(ledger.read().outcomes).toHaveLength(1);
  expect(Object.isFrozen(snap.pursuit.assumptions.value)).toBe(true);
 });
 it('requires reviewer, rationale and explicit human decision, including when eligibility fails',()=>{
  const {ledger,p}=setup();ledger.setEligibility(p.id,{requirement:'Bonding',state:'fail',reviewer:'Tester',assessedAt:NOW,evidence:{reference:'SYNTHETIC test'}});
  expect(ledger.read().snapshots).toHaveLength(0);
  expect(()=>ledger.decision(p.id,{decision:'Do not pursue',reviewer:'',rationale:'x'})).toThrow('reviewer');
  expect(()=>ledger.decision(p.id,{decision:'Do not pursue',reviewer:'Tester',rationale:''})).toThrow('rationale');
  expect(ledger.decision(p.id,{decision:'Needs evidence',reviewer:'Tester',rationale:'Review failure'}).decision).toBe('Needs evidence');
 });
 it('requires evidence for pass, fail and N/A; unknown and missing assessments become tasks',()=>{
  const {ledger,p}=setup();for(const state of ['pass','fail','not applicable'])expect(()=>ledger.setEligibility(p.id,{requirement:'Test',state,reviewer:'Tester',assessedAt:NOW})).toThrow('evidence');
  const snap=ledger.decision(p.id,{decision:'Needs evidence',reviewer:'Tester',rationale:'No assessments'});expect(snap.resolutionTasks[0].requirement).toBe('Eligibility not assessed');
  expect(()=>ledger.setEligibility(p.id,{requirement:'Test',state:'unknown',reviewer:'Tester',assessedAt:NOW,validUntil:'2026-02-30'})).toThrow('valid');
 });
 it('preserves recorded assessment but marks out-of-window evidence unknown',()=>{
  const {ledger,p}=setup();const entry=ledger.setEligibility(p.id,{requirement:'Test',state:'pass',reviewer:'Tester',assessedAt:'2026-11-01T15:00:00Z',validUntil:'2026-11-10',evidence:{reference:'Synthetic proof'}});
  expect(assessEligibility(entry,NOW).effectiveState).toBe('unknown');expect(entry.state).toBe('pass');
  expect(assessEligibility({...entry,validUntil:'2026-11-11'},NOW).effectiveState).toBe('pass');
  expect(assessEligibility({...entry,validFrom:'2026-11-12',validUntil:''},NOW).effectiveState).toBe('unknown');
 });
 it('records candidate-link reviews, keeps all records and snapshots link-time evidence',()=>{
  const {ledger,p,pkg}=setup();ledger.observe([{...record,id:'B'}],source);const other=ledger.read().packages[1];
  ledger.recordLink({fromPackageId:pkg.id,toPackageId:other.id,relationship:'possible amendment',status:'proposed',evidence:'SYNTHETIC shared PIN only',reviewer:'Tester'});
  const snap=ledger.decision(p.id,{decision:'Needs evidence',reviewer:'Tester',rationale:'Investigate relationship'});
  ledger.recordLink({fromPackageId:pkg.id,toPackageId:other.id,relationship:'possible amendment',status:'rejected',evidence:'SYNTHETIC distinct scopes',reviewer:'Tester'});
  expect(snap.candidateLinks).toHaveLength(1);expect(snap.noticeVersionsAvailable).toHaveLength(2);expect(ledger.read().links).toHaveLength(2);expect(ledger.read().packages).toHaveLength(2);
 });
 it('exports current edited assumptions, model metadata, source timestamps and separate outcomes',()=>{
  const {ledger,p}=setup();ledger.updateScenario(p.id,{values:{...values,margin:-10,confidence:0,capacity:0},origin:'Synthetic loss',asOf:NOW,scenarioName:'Loss stress'});
  const snap=ledger.decision(p.id,{decision:'Needs evidence',reviewer:'Tester',rationale:'Unresolved'});const data=JSON.parse(JSON.stringify(ledger.export()));
  expect(snap.financialModel.result!.velocity).toBe(-100000);expect(data.snapshots[0].financialModel.version).toBe('velocity-v2');
  expect(data.snapshots[0].pursuit.assumptions.value).toMatchObject({units:'USD million',origin:'Synthetic loss',asOf:new Date(NOW).toISOString()});
  expect(data.snapshots[0].noticeVersionsAvailable[0].versions[0].provenance.fetchedAt).toBe(NOW);expect(data.warning).toContain('No persistence');
 });
 it('does not ingest manual/private entries or leak sessions',()=>{
  const {ledger}=setup();ledger.observe([{...record,id:'private',manual:true}],source);expect(ledger.read().notices).toHaveLength(1);expect(createLedger().read().notices).toHaveLength(0);
  const code=fs.readFileSync('public/standalone/bid-radar-wdf-01/ledger.mjs','utf8');expect(code).not.toMatch(/localStorage|sessionStorage|indexedDB|fetch\(/);
 });
 it('never counts future assessments as known evidence and rejects incomplete URLs',()=>{
  const {ledger,p}=setup();const future=ledger.setEligibility(p.id,{requirement:'Test',state:'pass',reviewer:'Tester',assessedAt:'2026-11-12T15:00:00Z',evidence:{reference:'Synthetic future assessment'}});
  expect(assessEligibility(future,NOW).effectiveState).toBe('unknown');
  expect(ledger.decision(p.id,{decision:'Needs evidence',reviewer:'Tester',rationale:'Future assessment'}).resolutionTasks).toHaveLength(1);
  for(const url of ['https://','https://?q=test','javascript:alert(1)'])expect(()=>ledger.setEligibility(p.id,{requirement:'Test',state:'pass',reviewer:'Tester',assessedAt:NOW,evidence:{url}})).toThrow('complete');
 });
 it('preserves unsaved decision and eligibility drafts and edit identity across source-render events',()=>{
  const code=fs.readFileSync('public/standalone/bid-radar-wdf-01/ledger.mjs','utf8');
  const helpers=code.slice(code.indexOf('const DRAFT_IDS ='),code.indexOf('function feedback('));
  const event=code.split('\n').find(line=>line.startsWith("document.addEventListener('wdf:render'"))!;
  const result=vm.runInNewContext(String.raw`
    $=id=>controls[id];
    document.addEventListener=(_,callback)=>{handler=callback;};
    const observe=()=>{},commitScenario=()=>{};
    function render(){captureDraft();for(const node of Object.values(controls)){node.value='';node.checked=false;}editingEligibility='';restoreDraft();}
  `+helpers+event+String.raw`
    controls['decision-rationale'].value='Do not lose this rationale';
    controls['decision-reviewer'].value='Test lead';
    controls['eligibility-requirement'].value='Unsubmitted site visit check';
    controls['eligibility-reference'].value='Unsubmitted source reference';
    editingEligibility='existing-assessment';
    handler();
    ({rationale:controls['decision-rationale'].value,reviewer:controls['decision-reviewer'].value,requirement:controls['eligibility-requirement'].value,reference:controls['eligibility-reference'].value,editingEligibility});
  `,{
    formDrafts:new Map(),renderedPursuit:'p1',selected:'p1',active:true,editingEligibility:'',handler:null,
    controls:Object.fromEntries(['ledger-scenario','ledger-eligibility','decision-rationale','decision-reviewer','eligibility-requirement','eligibility-reference'].map(id=>[id,{value:'',checked:false,textContent:''}])),
    $:undefined,
    document:{},
  },{timeout:1000});
  expect(result).toEqual({rationale:'Do not lose this rationale',reviewer:'Test lead',requirement:'Unsubmitted site visit check',reference:'Unsubmitted source reference',editingEligibility:'existing-assessment'});
 });
 it('rejects cross-pursuit outcome linkage',()=>{
  const {ledger,p,pkg}=setup();const other=ledger.createPursuit({packageId:pkg.id,role:'subcontract',label:'Other'});const snap=ledger.decision(p.id,{decision:'Needs evidence',reviewer:'Tester',rationale:'Test'});
  expect(()=>ledger.outcome(other.id,{status:'Awarded',reviewer:'Tester',evidence:'Test',decisionId:snap.id})).toThrow('belong');
 });
});
describe('contextual source deadlines',()=>{
 it('never counts hours for offsetless, ambiguous, date-only or impossible deadlines',()=>{
  for(const value of ['2026-11-11T16:00:00','2026-11-01T01:30:00','2026-03-08T02:30:00','2026-11-11','2026-02-30','bad','2099-01-01T15:00:00Z',''])expect(deadlineStatus(value,NOW).countdown).toBeNull();
  expect(deadlineStatus('2026-11-11',NOW).label).toContain('Source date today');expect(deadlineStatus('2026-11-10T16:00:00',NOW).label).not.toContain('elapsed');
 });
 it('uses explicit offsets and textual urgency, not seconds or misleading exact days',()=>{
  expect(deadlineStatus('2026-11-11T11:30:00-04:00',NOW).label).toBe('Less than 1 hour remaining');
  expect(deadlineStatus('2026-11-11T18:00:00Z',NOW).label).toBe('Due today · about 3h remaining');
  expect(deadlineStatus('2026-11-11T15:00:00Z',NOW).state).toBe('elapsed');
  expect(deadlineStatus('2026-11-14T15:00:00Z',NOW).label).toBe('3 full days remaining');
  expect(deadlineStatus('2029-11-11T15:00:00Z',NOW).state).toBe('verify');
 });
 it('preserves source labels, safe HTML, explicit timezone evidence and invalid clock handling',()=>{
  expect(deadlineMarkup('2026-11-11T18:00:00')).toContain('timezone unverified');expect(deadlineMarkup('<img src=x>')).not.toContain('<img');
  expect(deadlineStatus('2026-11-11T18:00:00Z','bad').countdown).toBeNull();
 });
 it('retains all four themes, tabular numerals, responsive sizing and textual semantics',()=>{
  const css=fs.readFileSync('public/standalone/bid-radar-wdf-01/ledger.css','utf8');expect(css).toContain('tabular-nums');expect(css).toContain('prefers-reduced-motion');
  const html=fs.readFileSync('public/standalone/bid-radar-wdf-01/index.html','utf8');for(const theme of ['workshop','swiss','blueprint','editorial'])expect(html).toContain('value="'+theme+'"');
 });
});
