import { describe, expect, it } from 'vitest';
import { evaluateScenario } from '../src/dayos/engines/scenarioOverlay';

const base={nowSec:1000,anchorStartsAtSec:4600,basePrepMin:10,baseTransitSec:1200,baseBatteryEndPct:55};

describe('scenario overlay',()=>{
  it('preserves canonical input',()=>{
    const before=JSON.stringify(base);
    evaluateScenario(base,{id:'x',transitDeltaMin:15});
    expect(JSON.stringify(base)).toBe(before);
  });
  it('recomputes timing',()=>{
    const r=evaluateScenario(base,{id:'x',transitDeltaMin:15,prepDeltaMin:5});
    expect(r.leaveBySec).toBe(1900);
    expect(r.slackSec).toBe(900);
  });
});
