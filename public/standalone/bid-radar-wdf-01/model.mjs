export function economics(x){
 const required=['value','margin','months','risk','capital','rate','win','bid','confidence','capacity'];
 if(required.some(k=>x[k]===''||x[k]==null||!Number.isFinite(Number(x[k]))))return null;
 const n=Object.fromEntries(required.map(k=>[k,Number(x[k])]));
 if(n.value<0||n.months<=0||n.risk<0||n.capital<0||n.rate<0||n.bid<0||n.margin< -100||n.margin>100||['win','confidence','capacity'].some(k=>n[k]<0||n[k]>100))return null;
 const contribution=n.value*1e6*n.margin/100, funding=n.capital*1e6*n.rate/100*n.months/12;
 const adjusted=contribution-n.risk*1e6-funding, velocity=adjusted/n.months, ev=adjusted*n.win/100-n.bid*1000;
 return {contribution,funding,adjusted,velocity,ev,priority:velocity*n.confidence/100*n.capacity/100};
}
export function scopes(t){t=t.toLowerCase();const a=[];if(/\bmep\b|cooling|hvac|mechanical|plumb|boiler|steam|chiller|piping|ventilat|air.condition/.test(t))a.push('MEP');if(/roadway|curb|dam\b|flood|bridge|tunnel|sewer|water main|excavat|civil|infrastructure|stormwater|cso|wastewater/.test(t))a.push('Civil');if(/demolition|construction|renovation|building|general contract|rehabilitation/.test(t))a.push('GC');return a.length?a:['Other'];}
export function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function safeURL(s){try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
export function easternNow(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
export function dueLabel(s){if(!s)return 'Not published';const [day,time='']=s.split('T');return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(day+'T12:00:00Z'))+(time?' · '+time.slice(0,5)+' ET':'');}
export function clean(s){return String(s??'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
export function normalize(r){return {id:r.request_id,title:r.short_title||'Untitled notice',agency:r.agency_name||'Agency not published',description:clean(r.additional_description_1),due:r.due_date||'',published:r.start_date||'',pin:r.pin||'',method:r.selection_method_description||'',sector:'Public',url:'https://a856-cityrecord.nyc.gov/RequestDetail/'+encodeURIComponent(r.request_id)};}
