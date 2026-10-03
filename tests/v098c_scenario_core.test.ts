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
    // Engine formula: transit 1200+15*60 = 2100 s, prep (10+5)*60 = 900 s;
    // leaveBy = 4600 - 900 - 2100 = 1600, slack = 1600 - 1000 = 600.
    expect(r.leaveBySec).toBe(1600);
    expect(r.slackSec).toBe(600);
  });
});
