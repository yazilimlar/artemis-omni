import {deadlineEvidence, esc} from './model.mjs';
const DAY = 86400000;
// Reference zone is explicit for date-only/offsetless source-day comparisons, never assumed issuer time.
/** @param {string} value @param {Date|string|number} now */
export function deadlineStatus(value, now = new Date()) {
  const evidence = deadlineEvidence(value), at = new Date(now);
  if (!Number.isFinite(at.getTime())) return {evidence, state:'verify', label:'Clock unavailable · verify deadline', countdown:null};
  if (evidence.status === 'unknown') return {evidence, state:'unknown', label:'Deadline not published', countdown:null};
  if (evidence.status !== 'source value') return {evidence, state:'verify', label:'Verify source date', countdown:null};
  const referenceDate = new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(at);
  if (evidence.timezone === 'unknown') {
    const qualifier = evidence.raw.includes('T') ? 'timezone unverified' : 'time and timezone unverified';
    const relative = evidence.date < referenceDate ? 'Source date earlier' : evidence.date === referenceDate ? 'Source date today' : 'Source date ahead';
    return {evidence, state:'verify', label:relative + ' · ' + qualifier, detail:'Calendar comparison uses America/New_York today; confirm issuer time. No countdown.', countdown:null};
  }
  const due = Date.parse(evidence.raw), remaining = due - at.getTime();
  if (!Number.isFinite(due) || remaining > 730 * DAY) return {evidence, state:'verify', label:'Verify distant source deadline', countdown:null};
  if (remaining <= 0) return {evidence, state:'elapsed', label:'Deadline elapsed · revalidate status', countdown:null};
  const offset = evidence.timezone === 'Z' ? 0 : (evidence.timezone[0] === '+' ? 1 : -1) * (Number(evidence.timezone.slice(1,3))*60 + Number(evidence.timezone.slice(4)));
  const sourceToday = new Date(at.getTime() + offset*60000).toISOString().slice(0,10);
  if (remaining < 3600000) return {evidence, state:'urgent', label:'Less than 1 hour remaining', countdown:remaining};
  if (evidence.date === sourceToday) return {evidence, state:'urgent', label:'Due today · about ' + Math.floor(remaining/3600000) + 'h remaining', countdown:remaining};
  if (remaining < DAY) return {evidence, state:'soon', label:'About ' + Math.floor(remaining/3600000) + 'h remaining', countdown:remaining};
  const days = Math.floor(remaining/DAY);
  return {evidence, state:days <= 7 ? 'soon' : 'scheduled', label:days + (days === 1 ? ' full day remaining' : ' full days remaining'), countdown:remaining};
}
export function deadlineMarkup(value, now = new Date()) {
  const s = deadlineStatus(value, now);
  return `<span class="deadline-block" data-deadline="${esc(value || '')}"><span class="deadline-date">${esc(s.evidence.label)}</span><span class="deadline-status deadline-${s.state}" title="${esc(s.detail || 'Based on the explicit source offset. Verify addenda and current notice status.')}" data-deadline-status>${esc(s.label)}</span></span>`;
}
