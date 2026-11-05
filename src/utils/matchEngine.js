// The smart match engine (Objective 3 in the proposal).
// Score a pair of posts:  +2 same category, +2 same location, +1 dates within 3 days.
// Max score is 5. Pairs at or above MATCH_THRESHOLD are shown as "Possible matches".
// Later this same function can move into a Firebase Cloud Function unchanged.
import { parseISO } from './format';

export const MATCH_THRESHOLD = 3;
const DAY = 24 * 60 * 60 * 1000;

export function scoreMatch(a, b) {
  let score = 0;
  const reasons = [];
  if (a.category === b.category) {
    score += 2;
    reasons.push('Same category');
  }
  if (a.location === b.location) {
    score += 2;
    reasons.push('Same location');
  }
  const diffDays = Math.abs(Math.round((parseISO(a.date) - parseISO(b.date)) / DAY));
  if (diffDays <= 3) {
    score += 1;
    reasons.push('Dates within 3 days');
  }
  return { score, reasons };
}

// All open posts of the opposite type that score high enough, best first.
export function findMatches(item, allItems) {
  const opposite = item.type === 'lost' ? 'found' : 'lost';
  return allItems
    .filter(
      (o) =>
        o.id !== item.id &&
        o.type === opposite &&
        o.stage !== 'resolved' &&
        o.ownerId !== item.ownerId
    )
    .map((o) => ({ item: o, ...scoreMatch(item, o) }))
    .filter((m) => m.score >= MATCH_THRESHOLD)
    .sort((a, b) => b.score - a.score);
}
