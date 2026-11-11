import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import {economics,deadlineEvidence,dueLabel,normalize,esc} from '../../public/standalone/bid-radar-wdf-01/model.mjs';
const base={value:10,margin:10,months:10,risk:0,capital:0,rate:0,win:50,bid:0,confidence:100,capacity:100};
describe('WDF reliability pilot',()=>{
 it('never improves a loss by lowering subjective confidence or capacity',()=>{
  for(const margin of [-10,0,10])for(const confidence of [0,10,100])for(const capacity of [0,10,100]){
   const e=economics({...base,margin,confidence,capacity})!;
   expect(e.priority).toBe(e.velocity);expect(e.priority).toBe(margin*10000);
  }
 });
 it('has monotone signed financial ranking and finite valid outputs',()=>{
  expect(economics({...base,risk:2})!.priority).toBeLessThan(economics(base)!.priority);
  expect(economics({...base,margin:-20})!.priority).toBeLessThan(economics({...base,margin:-10})!.priority);
  for(const patch of [{value:''},{value:' '},{months:0},{value:Infinity},{value:1e308},{win:101}])expect(economics({...base,...patch})).toBeNull();
 });
 it('keeps time and timezone evidence distinct, including DST ambiguity',()=>{
  expect(dueLabel('2026-11-11T15:00:00Z')).toContain('15:00 UTC');
  expect(deadlineEvidence('2026-11-01T01:30:00').timezone).toBe('unknown');
  expect(deadlineEvidence('2026-03-08T02:30:00').timezone).toBe('unknown');
  expect(deadlineEvidence('2026-11-01T01:30:00-04:00').timezone).toBe('-04:00');
  expect(dueLabel('2026-11-11')).toContain('time not published');
  for(const date of ['invalid','2026-02-30','2026-11-11T25:00','2026-11-11T15:00+25:00'])expect(deadlineEvidence(date).status).toBe('needs verification');
  expect(deadlineEvidence('2099-01-01').status).toBe('needs verification');
  expect(deadlineEvidence('').status).toBe('unknown');
 });
 it('preserves separate notice identity when agency and PIN repeat',()=>{
  const rows=['amendment','cancellation','other package'].map((title,i)=>normalize({request_id:String(i),pin:'REUSED',agency_name:'A',short_title:title}));
  expect(new Set(rows.map(r=>r.id)).size).toBe(3);expect(rows.every(r=>r.pin==='REUSED')).toBe(true);
 });
 it('exports current assumptions after editing without rerendering',()=>{
  const app=fs.readFileSync('public/standalone/bid-radar-wdf-01/app.mjs','utf8');
  const renderSource=app.slice(app.indexOf('function renderDetail()'),app.indexOf('\nfunction brief('));
  const result=vm.runInNewContext(renderSource+String.raw`
   let inputHandler,exported;const controls={};
   const field={dataset:{field:'value'},value:'20',addEventListener:(_,handler)=>{inputHandler=handler;}};
   const $=id=>id==='save-decision'?null:controls[id]??=(id==='detail'?{querySelectorAll:s=>s==='[data-field]'?[field]:[]}:{textContent:'',innerHTML:''});
   const record={id:'notice-1',title:'Title',agency:'Agency',due:'2026-11-11T15:00:00Z',pin:'REUSED'};
   const saved={shortlist:[],cases:{'notice-1':{value:10,margin:10,months:10,risk:0,capital:0,rate:0,win:50,bid:0,confidence:100,capacity:100}}};
   const item=()=>record,scenario=id=>saved.cases[id],tab='economics',fields=[['value','Value']],fetched='2026-11-11T00:00:00Z';
   const calculated=()=>'',decision=()=>'',fmt=String,persist=()=>{},all=()=>[record],toggleSave=()=>{};
   const document={querySelector:()=>({textContent:''}),querySelectorAll:()=>[]};
   const download=(_,text)=>{exported=JSON.parse(text);};
   renderDetail();inputHandler();controls['export-case'].onclick();exported;
  `,{economics,deadlineEvidence,esc});
  expect(result.assumptions.value).toBe('20');expect(result.model.velocity).toBe(200000);expect(result.noticeId).toBe('notice-1');expect(result.deadlineEvidence.raw).toBe('2026-11-11T15:00:00Z');
 });
 it('exports explicit notice and deadline provenance without changing source rows',()=>{
  const app=fs.readFileSync('public/standalone/bid-radar-wdf-01/app.mjs','utf8');
  const intel=fs.readFileSync('public/standalone/bid-radar-wdf-01/intelligence.mjs','utf8');
  expect(app).toContain("['Notice ID','Dataset','Retrieved at'");expect(app).toContain('Deadline timezone evidence');
  expect(app).toContain('schemaVersion:2');expect(intel).toContain('Publication date raw');
  expect(intel).toContain('PIN (not contract identity)');
 });
});
