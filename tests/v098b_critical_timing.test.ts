import { describe, expect, it } from 'vitest';
import { computeCriticalTiming } from '../src/dayos/engines/criticalTiming';
import type { DayOSEntity } from '../src/dayos/core/types';
const t0=1700000000;
const entities:DayOSEntity[]=[{id:'hard-1',title:'Protected Anchor',startsAt:t0+3600,endsAt:t0+7200,rigidity:'HARD',readiness:'GO',prepMinutes:10,location:[41.5,-73.97]}];
describe('v0.9.8b critical timing',()=>{
 it('computes leave-by and positive slack',()=>{const x=computeCriticalTiming({entities,nowSec:t0,transitDurationSec:1200});expect(x.leaveBySec).toBe(t0+1800);expect(x.slackSec).toBe(1800);expect(x.risk).toBe('NOMINAL');});
 it('flags negative slack to protected anchor',()=>{const x=computeCriticalTiming({entities,nowSec:t0+2000,transitDurationSec:1200});expect(x.slackSec).toBeLessThan(0);expect(x.risk).toBe('INFEASIBLE');});
});
