import { describe, expect, it } from 'vitest';
import { projectScenario } from '../src/dayos/viewmodel/projectScenario';

const input = { nowSec: 1000, anchorStartsAtSec: 5000, basePrepMin: 10, baseTransitSec: 1200, baseBatteryEndPct: 60 };

describe('v0.9.8c scenario projection', () => {
  it('keeps canonical input immutable and reports derived deltas', () => {
    const before = JSON.stringify(input);
    const vm = projectScenario(input, { id: 'delay', transitDeltaMin: 15, batteryStartDeltaPct: -5 });
    expect(JSON.stringify(input)).toBe(before);
    expect(vm.changed).toBe(true);
    expect(vm.delta.leaveBySec).toBe(-900);
    expect(vm.delta.slackSec).toBe(-900);
    expect(vm.delta.batteryEndPct).toBe(-5);
  });

  it('baseline overlay produces zero deltas', () => {
    const vm = projectScenario(input, { id: 'same' });
    expect(vm.changed).toBe(false);
    expect(vm.delta.leaveBySec).toBe(0);
    expect(vm.delta.slackSec).toBe(0);
    expect(vm.delta.batteryEndPct).toBe(0);
  });
});
