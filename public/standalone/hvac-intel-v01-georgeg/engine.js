/* HVAC Studio calculation engine, v1.
 * All quantities and productivity rates are illustrative planning assumptions,
 * not ASHRAE/SMACNA labor standards or an engineered design. Geometry is in m.
 * x/y/z define the start of the centerline; length extends along positive axis.
 * z is local to the assigned floor. Duct area excludes end caps/fittings.
 * Weight uses nominal 0.8 mm steel at 7,850 kg/m3, including Pipe (placeholder).
 * Productivity is a dimensionless labor efficiency multiplier. Height penalty
 * is per metre above grade and affects field labor only. Waste affects material
 * purchase area/cost/weight, not installed geometry or labor. Contingency is a
 * project cost allowance, not hours. Duration is remaining field work for one
 * dedicated crew working floors in order; shop procurement is not modeled.
 */
(function(root,factory){const api=factory(); if(typeof module==='object'&&module.exports) module.exports=api; root.HVAC=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const constants=Object.freeze({version:'1.0.0',steelDensity:7850,steelThickness:0.0008,shopHoursPerM2:0.32,fieldHoursPerM2:0.24,fieldHoursPerSegment:0.35,maxSegments:2000});
const systems=['Supply','Return','Exhaust','Pipe'];
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
function defaultState(){
 const segments=[];
 for(let floor=1;floor<=48;floor++){
  segments.push({id:`SA-${String(floor).padStart(2,'0')}`,floor,system:'Supply',shape:'rect',x:2,y:7,z:2.7,length:24,width:0.9,height:0.5,diameter:0.5,axis:'x',quantity:1,progress:floor<=4?100:0});
  segments.push({id:`RA-${String(floor).padStart(2,'0')}`,floor,system:'Return',shape:'rect',x:2,y:11,z:2.7,length:24,width:0.7,height:0.4,diameter:0.5,axis:'x',quantity:1,progress:floor<=4?100:0});
  segments.push({id:`EX-${String(floor).padStart(2,'0')}`,floor,system:'Exhaust',shape:'round',x:18,y:2,z:floor%8===0?2.7:3.4,length:17,width:0.4,height:0.4,diameter:0.35,axis:'y',quantity:1,progress:floor<=4?100:0});
  segments.push({id:`CH-${String(floor).padStart(2,'0')}`,floor,system:'Pipe',shape:'round',x:3,y:15,z:3.1,length:22,width:0.15,height:0.15,diameter:0.15,axis:'x',quantity:1,progress:floor<=4?100:0});
 }
 return {schemaVersion:1,project:{name:'Northline Tower · Demonstration',floors:48,height:3.8,currency:'USD'},assumptions:{productivity:1,crew:8,hoursPerDay:8,workdaysPerWeek:5,shopRate:65,fieldRate:85,materialRate:12,waste:10,contingency:10,heightPenalty:0.003,clearance:0.15},segments,savedBaseline:null};
}
function validateState(s){
 const errors=[];
 const obj=(v)=>v!==null&&typeof v==='object'&&!Array.isArray(v);
 const num=(v,min,max,path,integer=false)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v))) errors.push(`${path}: expected ${integer?'integer':'number'} from ${min} to ${max}.`);};
 const str=(v,min,max,path)=>{if(typeof v!=='string'||v.length<min||v.length>max||/[\u0000-\u001f]/.test(v)) errors.push(`${path}: expected text of ${min}–${max} characters, without control characters.`);};
 if(!obj(s))return {valid:false,errors:['Project must be a JSON object.']};
 if(s.schemaVersion!==1)errors.push('Unsupported schemaVersion; expected 1.');
 if(!obj(s.project))errors.push('project: required object.'); else{
  str(s.project.name,1,160,'project.name'); num(s.project.floors,1,200,'project.floors',true);num(s.project.height,2,10,'project.height');
  if(!['USD','EUR','GBP','CAD','AUD'].includes(s.project.currency))errors.push('project.currency: use USD, EUR, GBP, CAD, or AUD.');
 }
 if(!obj(s.assumptions)) errors.push('assumptions: required object.'); else{
 const rules={productivity:[0.05,10],crew:[1,500,true],hoursPerDay:[1,24],workdaysPerWeek:[1,7,true],shopRate:[0,10000],fieldRate:[0,10000],materialRate:[0,100000],waste:[0,100],contingency:[0,100],heightPenalty:[0,0.1],clearance:[0,5]};
 for(const [k,[min,max,int]] of Object.entries(rules))num(s.assumptions[k],min,max,`assumptions.${k}`,int);
 }
 if(!Array.isArray(s.segments)||s.segments.length>constants.maxSegments) errors.push(`segments: expected an array of at most ${constants.maxSegments} items.`);
 else {const ids=new Set();s.segments.forEach((v,i)=>{
  const p=`segments[${i}]`;if(!obj(v)){errors.push(`${p}: required object.`);return;}
  str(v.id,1,80,`${p}.id`);if(ids.has(v.id))errors.push(`${p}.id: duplicate identifier.`);ids.add(v.id);
  num(v.floor,1,Number.isInteger(s.project?.floors)?s.project.floors:200,`${p}.floor`,true);
  if(!systems.includes(v.system))errors.push(`${p}.system: unknown system.`);
  if(!['rect','round'].includes(v.shape))errors.push(`${p}.shape: use rect or round.`);
  if(!['x','y','z'].includes(v.axis))errors.push(`${p}.axis: use x, y, or z.`);
  for(const k of ['x','y'])num(v[k],-1000,1000,`${p}.${k}`);
  num(v.z,0,1000,`${p}.z`);num(v.length,0.01,1000,`${p}.length`);
  for(const k of ['width','height','diameter'])num(v[k],0.01,20,`${p}.${k}`);
  num(v.quantity,1,1000,`${p}.quantity`,true);num(v.progress,0,100,`${p}.progress`);
 });}
 if(!own(s,'savedBaseline'))errors.push('savedBaseline: required (null or baseline object).');
 else if(s.savedBaseline!==null){if(!obj(s.savedBaseline))errors.push('savedBaseline: expected object or null.');else{
  str(s.savedBaseline.name,1,160,'savedBaseline.name');str(s.savedBaseline.createdAt,1,60,'savedBaseline.createdAt');
  if(!obj(s.savedBaseline.totals)) errors.push('savedBaseline.totals: required object.');else {for(const k of ['cost','totalHours','durationDays'])num(s.savedBaseline.totals[k],0,1e18,`savedBaseline.totals.${k}`);for(const [k,v]of Object.entries(s.savedBaseline.totals))num(v,0,1e18,`savedBaseline.totals.${k}`);}
 }}
 return {valid:errors.length===0,errors};
}
function bounds(s,padding=0){
 const w=s.shape==='round'?s.diameter:s.width,h=s.shape==='round'?s.diameter:s.height;
 const d=s.axis==='x'?[s.length,w,h]:s.axis==='y'?[w,s.length,h]:[w,h,s.length];
 const start=[s.x,s.y,s.z],axis=['x','y','z'].indexOf(s.axis);
 return {min:start.map((v,i)=>v-(i===axis?0:d[i]/2)-padding),max:start.map((v,i)=>v+(i===axis?d[i]:d[i]/2)+padding)};
}
function intersects(a,b){return a.min.every((v,i)=>Math.min(a.max[i],b.max[i])-Math.max(v,b.min[i])>1e-9);}
function calculate(s){
 const check=validateState(s); if(!check.valid){const err=new Error(check.errors.join('\n'));err.validationErrors=check.errors;throw err;}
 const a=s.assumptions;const warnings=['Illustrative straight-run model. Fittings, supports, insulation, equipment, pressure losses, code compliance, procurement, and commissioning are excluded.','Clashes are axis-aligned bounding-box screening, not BIM clearance certification. Round sections use enclosing boxes.'];
 const segments=s.segments.map(v=>{
  const perimeter=v.shape==='round'?Math.PI*v.diameter:2*(v.width+v.height);
  const section=v.shape==='round'?Math.PI*v.diameter*v.diameter/4:v.width*v.height;
  const area=perimeter*v.length*v.quantity,volume=section*v.length*v.quantity;
  const purchaseArea=area*(1+a.waste/100),weight=purchaseArea*constants.steelThickness*constants.steelDensity;
  const shopHours=area*constants.shopHoursPerM2/a.productivity;
  const elevation=(v.floor-1)*s.project.height+v.z;
  const fieldHours=(area*constants.fieldHoursPerM2+v.quantity*constants.fieldHoursPerSegment)*(1+elevation*a.heightPenalty)/a.productivity;
  const remainingFieldHours=fieldHours*(1-v.progress/100);
  const materialCost=purchaseArea*a.materialRate,laborCost=shopHours*a.shopRate+fieldHours*a.fieldRate;
  return {...v,area,volume,purchaseArea,weight,shopHours,fieldHours,remainingFieldHours,materialCost,laborCost,cost:materialCost+laborCost};
 });
 const totals={count:segments.length,quantity:0,length:0,area:0,volume:0,purchaseArea:0,weight:0,shopHours:0,fieldHours:0,remainingFieldHours:0,materialCost:0,laborCost:0,cost:0};
 for(const v of segments){totals.quantity+=v.quantity;totals.length+=v.length*v.quantity;for(const k of ['area','volume','purchaseArea','weight','shopHours','fieldHours','remainingFieldHours','materialCost','laborCost','cost'])totals[k]+=v[k];}
 totals.baseCost=totals.cost;totals.contingencyCost=totals.baseCost*a.contingency/100;totals.cost+=totals.contingencyCost;totals.totalHours=totals.shopHours+totals.fieldHours;
 totals.progress=totals.fieldHours?100*(1-totals.remainingFieldHours/totals.fieldHours):0;
 totals.durationDays=totals.remainingFieldHours/(a.crew*a.hoursPerDay);totals.durationWeeks=totals.durationDays/a.workdaysPerWeek;
 let cursor=0;const schedule=[];const floorGroups=new Map();for(const v of segments){if(!floorGroups.has(v.floor))floorGroups.set(v.floor,[]);floorGroups.get(v.floor).push(v);}
 for(const floor of [...floorGroups.keys()].sort((x,y)=>x-y)){
  const group=floorGroups.get(floor),fieldHours=group.reduce((sum,v)=>sum+v.fieldHours,0),remainingFieldHours=group.reduce((sum,v)=>sum+v.remainingFieldHours,0),durationDays=remainingFieldHours/(a.crew*a.hoursPerDay);
  schedule.push({floor,startDay:cursor,endDay:cursor+durationDays,durationDays,fieldHours,remainingFieldHours});cursor+=durationDays;
 }
 const clashes=[];
 for(const [floor,group]of floorGroups){const bb=group.map(v=>bounds(v));const expanded=group.map(v=>bounds(v,a.clearance/2));for(let i=0;i<group.length;i++)for(let j=i+1;j<group.length;j++){
  const overlap=intersects(bb[i],bb[j]);if(overlap||intersects(expanded[i],expanded[j]))clashes.push({id:`${group[i].id} / ${group[j].id}`,a:group[i].id,b:group[j].id,floor,type:overlap?'overlap':'clearance'});
 }}
 totals.clashCount=clashes.length;totals.overlapCount=clashes.filter(v=>v.type==='overlap').length;
 if(segments.some(v=>v.quantity>1))warnings.push('Quantity multiplies takeoff and hours only; repeated copies share one geometric location for clash screening.');
 if(segments.some(v=>bounds(v).max[2]>s.project.height))warnings.push('Some geometry extends above its assigned floor height. Cross-floor clashes are not tested.');
 return {totals,segments,schedule,clashes,warnings};
}
return {constants,defaultState,validateState,calculate,bounds};
});
