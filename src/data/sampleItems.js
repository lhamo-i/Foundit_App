// SAMPLE DATA for Stage 2. In Stage 3 these come from Firestore instead.
import { CATEGORY_ICONS } from '../utils/constants';

const make = (id, title, type, category, location, date, description, postedBy, isMine = false) => ({
  id,
  title,
  type,
  category,
  location,
  date,
  description,
  postedBy,
  isMine, // true = this post belongs to the signed-in sample user
  icon: CATEGORY_ICONS[category],
});

export const SAMPLE_ITEMS = [
  make('1', 'Black Wallet', 'lost', 'Wallet', 'Library', '2026-11-02',
    'A black leather wallet with a small keychain.', 'Tshering L.'),
  make('2', 'Earbuds', 'found', 'Electronics', 'Canteen', '2026-11-03',
    'White wireless earbuds in a charging case, found on a table.', 'You', true),
  make('3', 'Student ID Card', 'lost', 'ID Card', 'Academic Block', '2026-11-01',
    'CST student ID card, probably dropped near the lecture halls.', 'Sonam P.'),
  make('4', 'Water Bottle', 'found', 'Bottle', 'Sports Ground', '2026-11-01',
    'Dark blue steel water bottle with a flip lid.', 'Pema W.'),
  make('5', 'Backpack', 'lost', 'Bag', 'Hostel', '2026-10-30',
    'Beige backpack with two front pockets and a laptop sleeve.', 'Dorji T.'),
  make('6', 'Room Keys', 'found', 'Keys', 'Parking Area', '2026-11-03',
    'Set of three keys on a red ring.', 'You', true),
];

export function getSampleItem(id) {
  return SAMPLE_ITEMS.find((item) => item.id === id);
}
