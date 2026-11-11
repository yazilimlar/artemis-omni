export function periodRange(code,asOf='2026-11-11'){
 const y=Number(asOf.slice(0,4)),m=Number(asOf.slice(5,7)),q=Math.floor((m-1)/3)*3+1;let start,end=asOf,divisor=1,label;
 if(code==='qtd'){start=`${y}-${String(q).padStart(2,'0')}-01`;label='Quarter to date'}
 else if(code==='last'){start=`${y-1}-01-01`;end=`${y-1}-12-31`;label=`${y-1} calendar year`}
 else if(code==='2y'){start=`${y-2}-01-01`;end=`${y-1}-12-31`;label='Last 2 completed years'}
 else if(code==='3avg'||code==='5avg'){divisor=Number(code[0]);start=`${y-divisor}-01-01`;end=`${y-1}-12-31`;label=`${divisor}-year annual average`}
 else if(/^20\d\d$/.test(code)){start=code+'-01-01';end=Number(code)===y?asOf:code+'-12-31';label=code+(Number(code)===y?' year to date':' calendar year')}
 else {start=`${y}-01-01`;label='Year to date'}
 return {start,end,divisor,label};
}
export function stats(rows){const priced=rows.filter(r=>Number.isFinite(Number(r.contract_amount))&&Number(r.contract_amount)>0),values=priced.map(r=>Number(r.contract_amount)).sort((a,b)=>a-b),total=values.reduce((a,b)=>a+b,0);return {count:rows.length,priced:priced.length,total,median:values.length?(values[Math.floor((values.length-1)/2)]+values[Math.ceil((values.length-1)/2)])/2:null,largest:priced.reduce((a,b)=>!a||Number(b.contract_amount)>Number(a.contract_amount)?b:a,null)};}
export function groupRows(rows,key){const m=new Map();for(const r of rows){const k=r[key]||'Not published';if(!m.has(k))m.set(k,[]);m.get(k).push(r)}return [...m].map(([name,records])=>({name,records,...stats(records)})).sort((a,b)=>b.total-a.total)}
export function filterAwards(rows,{period='ytd',agency='',method='',category='',query='',min=0},asOf){const p=periodRange(period,asOf);return rows.filter(r=>r.start_date.slice(0,10)>=p.start&&r.start_date.slice(0,10)<=p.end&&(!agency||r.agency_name===agency)&&(!method||r.selection_method_description===method)&&(!category||r.category_description===category)&&(!min||Number(r.contract_amount)>=min)&&(!query||[r.short_title,r.agency_name,r.vendor_name,r.pin].join(' ').toLowerCase().includes(query.toLowerCase())))}
export function periods(rows,p,granularity='quarter'){
 const result=[],startYear=Number(p.start.slice(0,4)),endYear=Number(p.end.slice(0,4));
 for(let y=startYear;y<=endYear;y++){for(let q=1;q<=(granularity==='annual'?1:4);q++){const start=granularity==='annual'?`${y}-01-01`:`${y}-${String((q-1)*3+1).padStart(2,'0')}-01`;const end=granularity==='annual'?`${y}-12-31`:`${y}-${String(q*3).padStart(2,'0')}-${q===1||q===4?'31':'30'}`;if(end<p.start||start>p.end)continue;const found=rows.filter(r=>r.start_date.slice(0,10)>=start&&r.start_date.slice(0,10)<=end);result.push({name:granularity==='annual'?String(y):`Q${q} ${String(y).slice(2)}`,start,end,partial:start<p.start||end>p.end,...stats(found)})}}
 return result;
}
