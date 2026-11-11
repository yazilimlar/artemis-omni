import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { labSandbox } from '@/lib/standalone-labs';
const dir = 'public/standalone/bid-radar-wdf-01/';
describe('WDF public lab', () => {
  it('isolates the lab and preserves source transparency', () => {
    expect(labSandbox('bid-radar-wdf-01')).not.toContain('allow-same-origin');
    const html = fs.readFileSync(dir+'index.html','utf8');
    expect(html).not.toContain('vercel.live');
    expect(html).toContain('memory until this page reloads');
    expect(html).toContain('id="add-submit"');
    expect(fs.readFileSync(dir+'app.mjs','utf8')).toContain('Opaque-origin sandbox');
  });
  it('ships complete dated public notices, never synthetic awards', () => {
    const data = JSON.parse(gunzipSync(fs.readFileSync(dir+'awards.json.gz')).toString());
    expect(data.records).toHaveLength(2663);
    expect(new Set(data.records.map((r: {request_id: string})=>r.request_id)).size).toBe(2663);
    expect(data.metadata.source_url).toBe('https://data.cityofnewyork.us/resource/dg92-zbpx.json');
    const years: Record<string,number>={};
    for (const r of data.records) years[r.start_date.slice(0,4)]=(years[r.start_date.slice(0,4)]||0)+1;
    expect(years).toEqual({'2021':342,'2022':539,'2023':527,'2024':539,'2025':395,'2026':321});
    expect(Math.max(...data.records.map((r: {contract_amount: string})=>Number(r.contract_amount)))).toBe(3984820000);
  });
  it('ships all relative runtime modules and licensed fonts',()=>{
    for(const f of ['app.mjs','model.mjs','intelligence.mjs','intelligence-model.mjs','style.css','intelligence.css','snapshot.json']) expect(fs.statSync(dir+f).size).toBeGreaterThan(100);
    for(const f of ['archivo','inter','plex','serif']) {
      expect(fs.readFileSync(dir+'fonts/'+f+'.woff2').subarray(0,4).toString()).toBe('wOF2');
      expect(fs.readFileSync(dir+'fonts/'+f+'-LICENSE.txt','utf8')).toContain('SIL OPEN FONT LICENSE');
    }
  });
});
