import {economics, deadlineEvidence} from './model.mjs';

// Public/test-data-only session model. Immutability here is not authentication or a secure audit log.
export const LEDGER_SCHEMA = 'wdf-session-ledger-v1';
export const ROLES = ['prime', 'subcontract', 'joint venture', 'other'];
export const DECISIONS = ['Needs evidence', 'Proceed to human review', 'Continue estimating', 'Do not pursue'];
export const OUTCOMES = ['Submitted', 'Awarded', 'Not awarded', 'Withdrawn', 'Cancelled', 'Unknown'];
export const ASSUMPTION_FIELDS = [
  ['value', 'Contract value', 'USD million'], ['margin', 'Contribution margin', '%'],
  ['months', 'Duration', 'months'], ['risk', 'Risk allowance', 'USD million'],
  ['capital', 'Average capital tied up', 'USD million'], ['rate', 'Annual capital cost', '%'],
  ['win', 'Assumed award probability', '%'], ['bid', 'Bid preparation cost', 'USD thousand'],
  ['confidence', 'Estimate confidence', '%'], ['capacity', 'Capacity availability', '%'],
];
const copy = value => JSON.parse(JSON.stringify(value));
function freeze(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
  return value;
}
const readonly = value => freeze(copy(value));
function required(value, label) { if (!String(value ?? '').trim()) throw Error(label + ' is required.'); return String(value).trim(); }
function instant(value, label) {
  const e = deadlineEvidence(value);
  if (e.status !== 'source value' || e.timezone === 'unknown' || !Number.isFinite(Date.parse(value))) throw Error(label + ' needs a valid timestamp with timezone.');
  return new Date(value).toISOString();
}
function dateOnly(value) {
  if (!value) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || deadlineEvidence(value).status !== 'source value') throw Error('Validity dates must be valid YYYY-MM-DD dates.');
  return value;
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
}
export function assessEligibility(entry, at) {
  const time = instant(at, 'Assessment time'), day = time.slice(0, 10);
  if (Date.parse(entry.assessedAt) > Date.parse(time)) return {...entry, effectiveState:'unknown', resolution:'Assessment is dated after this decision; recheck the assessment time.'};
  if (entry.validFrom && day < entry.validFrom) return {...entry, effectiveState:'unknown', resolution:'Validity has not started; recheck evidence.'};
  if (entry.validUntil && day > entry.validUntil) return {...entry, effectiveState:'unknown', resolution:'Evidence validity expired; recheck evidence.'};
  return {...entry, effectiveState:entry.state, resolution:entry.state === 'unknown' ? 'Resolve missing evidence with the issuer or reviewer.' : ''};
}
export function createLedger({now = () => new Date().toISOString()} = {}) {
  const state = {schemaVersion:LEDGER_SCHEMA, classification:'public facts and non-confidential test assumptions only', persistence:'session only; reload clears all records', projects:[], packages:[], notices:[], pursuits:[], links:[], snapshots:[], outcomes:[]};
  let sequence = 0;
  const id = prefix => prefix + '-' + (++sequence);
  const stamp = () => instant(now(), 'Record time');
  const find = (kind, value) => { const row = state[kind].find(x => x.id === value); if (!row) throw Error('Unknown ' + kind + ' record.'); return row; };
  function observe(records, provenance) {
    const capturedAt = stamp();
    for (const record of records) {
      if (record.manual) continue; // No private/manual intake copied into this public pilot.
      const sourceId = required(record.id, 'Notice ID');
      const dataset = required(provenance.dataset, 'Dataset');
      const identity = JSON.stringify([dataset, sourceId]);
      let notice = state.notices.find(n => n.identity === identity);
      if (!notice) {
        const project = {id:id('project'), title:record.title, status:'provisional local container; not verified project identity'};
        const pkg = {id:id('package'), projectId:project.id, title:record.title, status:'unlinked notice package; not a deduplicated contract'};
        notice = {id:id('notice'), identity, sourceId, dataset, packageId:pkg.id, versions:[]};
        state.projects.push(project); state.packages.push(pkg); state.notices.push(notice);
      }
      const facts = copy(record);
      if (!notice.versions.length || JSON.stringify(canonical(notice.versions.at(-1).facts)) !== JSON.stringify(canonical(facts))) {
        notice.versions.push(freeze({id:id('version'), capturedAt, provenance:copy(provenance), facts}));
      }
    }
    return readonly(state.notices);
  }
  function createPursuit({packageId, role, label}) {
    find('packages', packageId);
    if (!ROLES.includes(role)) throw Error('Choose a pursuit role.');
    const pursuit = {id:id('pursuit'), packageId, role, label:required(label, 'Pursuit label'), createdAt:stamp(), scenarioName:'Untitled test scenario', assumptions:{}, eligibility:[]};
    state.pursuits.push(pursuit);
    return readonly(pursuit);
  }
  function updateScenario(pursuitId, {values, origin, asOf, scenarioName}) {
    const pursuit = find('pursuits', pursuitId);
    const date = instant(asOf, 'Assumption as-of time');
    const source = required(origin, 'Assumption origin');
    const assumptions = Object.fromEntries(ASSUMPTION_FIELDS.map(([key, , units]) => {
      const value = values[key] ?? '';
      if (typeof value !== 'string' && (typeof value !== 'number' || !Number.isFinite(value))) throw Error('Assumptions must be finite numbers or text.');
      return [key, {value, units, origin:source, asOf:date, classification:'user-entered test assumption; unverified'}];
    }));
    pursuit.scenarioName = required(scenarioName, 'Scenario name'); pursuit.assumptions = assumptions;
    return readonly(pursuit);
  }
  function setEligibility(pursuitId, entry) {
    const pursuit = find('pursuits', pursuitId);
    if (!['pass', 'fail', 'unknown', 'not applicable'].includes(entry.state)) throw Error('Choose an eligibility state.');
    const evidence = {reference:String(entry.evidence?.reference || '').trim(), url:String(entry.evidence?.url || '').trim()};
    if (evidence.url) {
      try { const url = new URL(evidence.url); if (!['http:', 'https:'].includes(url.protocol) || !url.hostname) throw Error('invalid'); }
      catch { throw Error('Evidence URL must be a complete http or https address.'); }
    }
    if (entry.state !== 'unknown' && !evidence.reference && !evidence.url) throw Error('Pass, fail and not applicable require evidence or a document reference.');
    const from = dateOnly(entry.validFrom), until = dateOnly(entry.validUntil);
    if (from && until && from > until) throw Error('Validity end must follow its start.');
    if (entry.id && !pursuit.eligibility.some(e => e.id === entry.id)) throw Error('Unknown eligibility record.');
    const row = {id:entry.id || id('eligibility'), requirement:required(entry.requirement, 'Requirement'), applicableRole:pursuit.role, state:entry.state, evidence, reviewer:required(entry.reviewer, 'Reviewer'), assessedAt:instant(entry.assessedAt, 'Assessed-at time'), validFrom:from, validUntil:until};
    pursuit.eligibility = [...pursuit.eligibility.filter(e => e.id !== row.id), row];
    return readonly(row);
  }
  function recordLink({fromPackageId, toPackageId, relationship, status, evidence, reviewer}) {
    find('packages', fromPackageId); find('packages', toPackageId);
    if (fromPackageId === toPackageId) throw Error('Choose a different package.');
    if (!['proposed', 'confirmed', 'rejected'].includes(status)) throw Error('Choose a link review status.');
    if (!['possible amendment', 'possible cancellation', 'related package', 'possible duplicate'].includes(relationship)) throw Error('Choose a relationship.');
    const row = freeze({id:id('link'), fromPackageId, toPackageId, relationship, status, evidence:required(evidence, 'Link evidence'), reviewer:required(reviewer, 'Link reviewer'), recordedAt:stamp(), effect:'review record only; identities, money and deadlines are not merged'});
    state.links.push(row); return readonly(row);
  }
  function decision(pursuitId, {decision:choice, reviewer, rationale}) {
    const pursuit = find('pursuits', pursuitId), recordedAt = stamp();
    if (!DECISIONS.includes(choice)) throw Error('Choose a human decision.');
    const pkg = find('packages', pursuit.packageId);
    const links = state.links.filter(l => l.fromPackageId === pkg.id || l.toPackageId === pkg.id);
    const packageIds = new Set([pkg.id, ...links.flatMap(l => [l.fromPackageId,l.toPackageId])]);
    const notices = state.notices.filter(n => packageIds.has(n.packageId));
    const inputs = Object.fromEntries(Object.entries(pursuit.assumptions).map(([k,v]) => [k,v.value]));
    const eligibility = pursuit.eligibility.map(e => assessEligibility(e, recordedAt));
    const resolutionTasks = eligibility.filter(e => e.effectiveState === 'unknown').map(e => ({requirement:e.requirement, action:e.resolution, reviewer:e.reviewer}));
    if (!eligibility.length) resolutionTasks.push({requirement:'Eligibility not assessed', action:'Identify requirements and supporting evidence for this role.', reviewer});
    const row = readonly({id:id('decision'), schemaVersion:LEDGER_SCHEMA, recordedAt, reviewer:required(reviewer, 'Decision reviewer'), rationale:required(rationale, 'Decision rationale'), decision:choice, project:find('projects',pkg.projectId), package:pkg, pursuit, noticeVersionsAvailable:notices, candidateLinks:links, eligibility, resolutionTasks, financialModel:{version:'velocity-v2', inputs, result:economics(inputs), probabilityStatus:'user assumption; not calibrated'}, warnings:['Human-recorded decision, not authorization to bid.', 'Alternative pursuits are not additive. No package or contract totals are calculated.', 'Session copy only; identities and timestamps are self-reported, not authenticated.']});
    state.snapshots.push(row); return row;
  }
  function outcome(pursuitId, {status, reviewer, evidence, decisionId = ''}) {
    find('pursuits', pursuitId);
    if (!OUTCOMES.includes(status)) throw Error('Choose an outcome.');
    if (decisionId && find('snapshots', decisionId).pursuit.id !== pursuitId) throw Error('Outcome decision must belong to this pursuit.');
    const row = freeze({id:id('outcome'), pursuitId, decisionId, status, reviewer:required(reviewer, 'Outcome reviewer'), evidence:required(evidence, 'Outcome evidence'), recordedAt:stamp(), classification:'separate user-reported outcome; not decision-time evidence'});
    state.outcomes.push(row); return readonly(row);
  }
  return Object.freeze({observe, createPursuit, updateScenario, setEligibility, recordLink, decision, outcome, read:() => readonly(state), export:() => readonly({...state, exportedAt:stamp(), warning:'Export before reloading. No persistence, import, authentication, confidential-data protection, secure audit trail or automatic decision. Retain this file independently.'})});
}
