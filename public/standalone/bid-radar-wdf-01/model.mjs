export function economics(x){
 const required=['value','margin','months','risk','capital','rate','win','bid','confidence','capacity'];
 if(required.some(k=>String(x[k]??'').trim()===''||x[k]==null||!Number.isFinite(Number(x[k]))))return null;
 const n=Object.fromEntries(required.map(k=>[k,Number(x[k])]));
 if(n.value<0||n.months<=0||n.risk<0||n.capital<0||n.rate<0||n.bid<0||n.margin< -100||n.margin>100||['win','confidence','capacity'].some(k=>n[k]<0||n[k]>100))return null;
 const contribution=n.value*1e6*n.margin/100, funding=n.capital*1e6*n.rate/100*n.months/12;
 const adjusted=contribution-n.risk*1e6-funding, velocity=adjusted/n.months, ev=adjusted*n.win/100-n.bid*1000;
 if(![contribution,funding,adjusted,velocity,ev].every(Number.isFinite))return null;
 // Compatibility alias only. Subjective confidence/capacity must not erase a modeled loss.
 return {contribution,funding,adjusted,velocity,ev,priority:velocity,confidence:n.confidence,capacity:n.capacity,modelVersion:'velocity-v2'};
}
export function scopes(t){t=t.toLowerCase();const a=[];if(/\bmep\b|cooling|hvac|mechanical|plumb|boiler|steam|chiller|piping|ventilat|air.condition/.test(t))a.push('MEP');if(/roadway|curb|dam\b|flood|bridge|tunnel|sewer|water main|excavat|civil|infrastructure|stormwater|cso|wastewater/.test(t))a.push('Civil');if(/demolition|construction|renovation|building|general contract|rehabilitation/.test(t))a.push('GC');return a.length?a:['Other'];}
export function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function safeURL(s){try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
export function easternNow(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function deadlineEvidence(value){
 const raw=String(value??'').trim();
 const missing={raw,status:'unknown',date:'',month:'',timezone:'unknown',label:'Not published'};
 if(!raw)return missing;
 const m=raw.match(/^(\d{4}-\d{2}-\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/);
 const invalid={...missing,raw,status:'needs verification',label:'Invalid deadline · verify source'};
 if(!m)return invalid;
 const day=new Date(m[1]+'T12:00:00Z');
 if(!Number.isFinite(day.getTime())||day.toISOString().slice(0,10)!==m[1]||Number(m[2]||0)>23||Number(m[3]||0)>59||Number(m[4]||0)>59)return invalid;
 if(m[5]&&m[5]!=='Z'&&(Number(m[5].slice(1,3))>23||Number(m[5].slice(4))>59))return invalid;
 const dateLabel=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(day);
 const timezone=m[5]||'unknown';
 const label=dateLabel+(m[2]?' · '+m[2]+':'+m[3]+(m[5]?' '+(m[5]==='Z'?'UTC':m[5]):' · timezone unverified'):' · time not published');
 return {raw,status:Number(m[1].slice(0,4))>=2090?'needs verification':'source value',date:m[1],month:m[1].slice(0,7),timezone,label:label+(Number(m[1].slice(0,4))>=2090?' · placeholder date, verify':'')};
}
export function dueLabel(s){return deadlineEvidence(s).label;}
export function clean(s){return String(s??'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
export function normalize(r){return {id:r.request_id,title:r.short_title||'Untitled notice',agency:r.agency_name||'Agency not published',description:clean(r.additional_description_1),due:r.due_date||'',published:r.start_date||'',pin:r.pin||'',method:r.selection_method_description||'',sector:'Public',url:'https://a856-cityrecord.nyc.gov/RequestDetail/'+encodeURIComponent(r.request_id)};}
