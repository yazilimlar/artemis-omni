import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { csvCell, csvText } from '../../public/standalone/bid-radar-wdf-01/export.mjs';
describe('WDF CSV export',()=>{
  it('quotes commas, quotes and multiline values without data loss',()=>{
    expect(csvText([['a','b'],['c,d','e\nf'],['a"b','']])).toBe('"a","b"\r\n"c,d","e\nf"\r\n"a""b",""');
  });
  it('prefixes spreadsheet formula triggers without removing content',()=>{
    for(const value of ['=1+1','+1','@x','-2','\tx','\rx']) expect(csvCell(value)).toBe('"\''+value+'"');
  });
  it('provides a user-activated link and copyable fallback, with honest status',()=>{
    const source=fs.readFileSync('public/standalone/bid-radar-wdf-01/export.mjs','utf8');
    expect(source).toContain("link.download=filename");
    expect(source).toContain('textarea.value=content');
    expect(source).toContain('cannot confirm that the file was saved');
    expect(source).not.toMatch(/\.click\(\)|setTimeout/);
  });
});
