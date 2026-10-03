import { describe, expect, it } from 'vitest';
import { evaluateScenario } from '../src/dayos/engines/scenarioOverlay';

const base={nowSec:1000,anchorStartsAtSec:4600,basePrepMin:10,baseTransitSec:1200,baseBatteryEndPct:55};

describe('scenario feasibility',()=>{
  it('rejects negative slack',()=>{
    const r=evaluateScenario(base,{id:'late',transitDeltaMin:40});
    expect(r.feasible).toBe(false);
  });
  it('rejects low reserve',()=>{
    const r=evaluateScenario(base,{id:'low',batteryStartDeltaPct:-40});
    expect(r.batteryEndPct).toBe(15);
    expect(r.feasible).toBe(false);
  });
});
