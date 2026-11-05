// Fixed lists used across the app. Change them here and every screen updates.
// (When you add Firebase, locations and categories can stay as constants.)

// Registration only accepts campus email addresses.
export const CAMPUS_EMAIL_DOMAIN = 'rub.edu.bt';

export const isValidCampusEmail = (email) =>
  /^\d+\.cst@rub\.edu\.bt$/i.test(email.trim());

export const CATEGORIES = [
  { name: 'Wallet', icon: 'wallet-outline' },
  { name: 'Phone', icon: 'phone-portrait-outline' },
  { name: 'Earbuds / Headphones', icon: 'headset-outline' },
  { name: 'ID Card', icon: 'card-outline' },
  { name: 'Keys', icon: 'key-outline' },
  { name: 'Bag / Backpack', icon: 'bag-handle-outline' },
  { name: 'Bottle', icon: 'water-outline' },
  { name: 'Books / Stationery', icon: 'book-outline' },
  { name: 'Laptop / Electronics', icon: 'laptop-outline' },
  { name: 'Clothing', icon: 'shirt-outline' },
  { name: 'Other', icon: 'cube-outline' },
];
export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);
export const categoryIcon = (name) =>
  (CATEGORIES.find((c) => c.name === name) || { icon: 'cube-outline' }).icon;

// Real CST places (replaces free-text location, keeps filtering and matching accurate)
export const LOCATIONS = [
  'Library',
  'Canteen',
  'Academic Block',
  'Hostel Mess',
  'Sports Ground',
  'Hostel Block',
  'Parking Area',
];

// How the poster wants to be contacted. Hidden until a claim is submitted.
export const CONTACT_METHODS = [
  { key: 'phone', label: 'Phone', icon: 'call-outline', placeholder: 'e.g. 17XXXXXX', keyboard: 'phone-pad' },
  { key: 'email', label: 'Email', icon: 'mail-outline', placeholder: 'name@rub.edu.bt', keyboard: 'email-address' },
  { key: 'whatsapp', label: 'WhatsApp / Telegram', icon: 'logo-whatsapp', placeholder: 'Number or username', keyboard: 'default' },
  { key: 'chat', label: 'In-app chat only', icon: 'chatbubble-ellipses-outline' },
];
export const contactMethodInfo = (key) =>
  CONTACT_METHODS.find((m) => m.key === key) || CONTACT_METHODS[3];

// The three handover options from the proposal
export const HANDOVER_OPTIONS = [
  {
    key: 'dropoff',
    label: 'Drop-off point',
    desc: 'Leave it with campus staff. Best for valuables.',
    icon: 'business-outline',
    places: ['Security Office', 'Library Desk', "Hostel Warden's Room"],
  },
  {
    key: 'meetup',
    label: 'Public meet-up',
    desc: 'Meet at a busy campus spot.',
    icon: 'people-outline',
    places: ['Canteen', 'Library Entrance', 'Academic Block Lobby'],
  },
  {
    key: 'keeps',
    label: 'Finder keeps it',
    desc: 'Agree a pickup time in the in-app chat.',
    icon: 'hand-left-outline',
    places: [],
  },
];
export const handoverInfo = (key) => HANDOVER_OPTIONS.find((h) => h.key === key);

// The five stages of a post (Figure 2.1 in the proposal)
export const STAGES = [
  { key: 'posted', label: 'Posted' },
  { key: 'claim_requested', label: 'Claim requested' },
  { key: 'claim_approved', label: 'Claim approved' },
  { key: 'handed_over', label: 'Handed over' },
  { key: 'resolved', label: 'Resolved' },
];
export const stageLabel = (key) => (STAGES.find((s) => s.key === key) || STAGES[0]).label;

// Good Samaritan points
export const POINTS_PER_RETURN = 10;
export const BADGES = [
  { key: 'honest', name: 'Honest Finder', icon: 'ribbon-outline', minReturns: 1, desc: 'Return 1 item' },
  { key: 'hero', name: 'Campus Hero', icon: 'trophy-outline', minReturns: 5, desc: 'Return 5 items' },
];

export const REMINDER_AFTER_HOURS = 48;
