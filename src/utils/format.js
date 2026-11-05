
// Small helpers for dates, times and ids.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// A unique id. With Firebase, Firestore creates ids for you.
export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

// Convert strings, Date objects and Firestore Timestamps into Date objects.
export function toDate(value) {
  if (!value) return new Date();

  if (value instanceof Date) return value;

  if (typeof value === 'string') {
    // Handle YYYY-MM-DD without timezone shifting.
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3])
      );
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  // Firestore Timestamp
  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  // Unix timestamp in milliseconds
  if (typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  return new Date();
}

export function toISODate(value = new Date()) {
  const d = toDate(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const todayISO = () => toISODate(new Date());

export function daysAgoISO(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toISODate(d);
}

export function parseISO(value) {
  return toDate(value);
}

// "3 Nov 2026"
export function formatDate(value) {
  if (!value) return '';
  const d = toDate(value);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// "Today", "Yesterday", or "Mon, 3 Nov"
export function dateLabel(value) {
  if (!value) return '';

  const iso = toISODate(value);

  if (iso === todayISO()) return 'Today';
  if (iso === daysAgoISO(1)) return 'Yesterday';

  const d = toDate(value);
  return `${DAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

// "Just now", "5m ago", "2h ago", "3d ago"
export function timeAgo(value) {
  if (!value) return 'Just now';

  const d = toDate(value);
  const diff = Math.max(0, Date.now() - d.getTime());

  const min = Math.floor(diff / 60000);

  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;

  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

// "10:24 AM"
export function formatTime(value) {
  const d = toDate(value);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

// Contact privacy: show only the first 4 characters of a student ID.
export function maskStudentId(id) {
  if (!id) return '';
  const value = String(id);
  return value.length <= 4
    ? value
    : value.slice(0, 4) + 'x'.repeat(value.length - 4);
}
