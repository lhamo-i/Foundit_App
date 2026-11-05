// DEMO DATA so every screen has something to show before Firebase is connected.
// In Stage 3 these arrays are replaced by Firestore collections with the same shapes.
//
// Demo logins (Student ID / password):
//   02240189 / password123   -> Tshering Lhamo (you)
//   02240101 / password123   -> Alex Wang
//   02240102 / password123   -> Pema Dorji
//   02240103 / password123   -> Sonam Choden
import { daysAgoISO } from '../utils/format';

const HOUR = 60 * 60 * 1000;
const ago = (hours) => Date.now() - hours * HOUR;

export const SEED_USERS = [
  { id: 'u1', name: 'Tshering Lhamo', studentId: '02240189', email: '02240189.cst@rub.edu.bt', password: 'password123', phone: '17123456', avatarUri: null, points: 10, returns: 1 },
  { id: 'u2', name: 'Alex Wang', studentId: '02240101', email: '02240101.cst@rub.edu.bt', password: 'password123', phone: '17234567', avatarUri: null, points: 20, returns: 2 },
  { id: 'u3', name: 'Pema Dorji', studentId: '02240102', email: '02240102.cst@rub.edu.bt', password: 'password123', phone: '17345678', avatarUri: null, points: 60, returns: 6 },
  { id: 'u4', name: 'Sonam Choden', studentId: '02240103', email: '02240103.cst@rub.edu.bt', password: 'password123', phone: '17456789', avatarUri: null, points: 0, returns: 0 },
];

// stage: posted | claim_requested | claim_approved | handed_over | resolved
export const SEED_ITEMS = [
  {
    id: 'i1', type: 'lost', title: 'Black Wallet', description: 'A black leather wallet with a small keychain.',
    category: 'Wallet', location: 'Library', date: daysAgoISO(2), imageUri: null, icon: 'wallet-outline',
    ownerId: 'u1', createdAt: ago(46), stage: 'posted',
    questions: ['What brand is the wallet?', 'What colour is the inside?'],
    contactMethod: 'chat', contactValue: '', handover: null,
    approvedClaimId: null, finderConfirmed: false, receiverConfirmed: false,
  },
  {
    id: 'i2', type: 'found', title: 'Earbuds', description: 'White wireless earbuds in a charging case.',
    category: 'Earbuds / Headphones', location: 'Canteen', date: daysAgoISO(1), imageUri: null, icon: 'headset-outline',
    ownerId: 'u1', createdAt: ago(20), stage: 'claim_requested',
    questions: ['What colour is the case?', 'Is there any sticker or scratch on it?'],
    contactMethod: 'phone', contactValue: '17123456', handover: { type: 'dropoff', place: 'Library Desk' },
    approvedClaimId: null, finderConfirmed: false, receiverConfirmed: false,
  },
  {
    id: 'i3', type: 'found', title: 'Black Leather Wallet', description: 'Found on a table near the reading area. Has a few cards inside.',
    category: 'Wallet', location: 'Library', date: daysAgoISO(1), imageUri: null, icon: 'wallet-outline',
    ownerId: 'u3', createdAt: ago(22), stage: 'posted',
    questions: ['What brand is the wallet?', 'What colour is the inside?'],
    contactMethod: 'email', contactValue: '02240102.cst@rub.edu.bt', handover: { type: 'dropoff', place: 'Security Office' },
    approvedClaimId: null, finderConfirmed: false, receiverConfirmed: false,
  },
  {
    id: 'i4', type: 'found', title: 'Water Bottle', description: 'Navy blue steel bottle with a screw cap.',
    category: 'Bottle', location: 'Sports Ground', date: daysAgoISO(4), imageUri: null, icon: 'water-outline',
    ownerId: 'u4', createdAt: ago(90), stage: 'handed_over',
    questions: ['Is there a sticker on the bottle? Which one?'],
    contactMethod: 'chat', contactValue: '', handover: { type: 'dropoff', place: 'Library Desk' },
    approvedClaimId: 'c2', finderConfirmed: true, receiverConfirmed: false, firstConfirmAt: ago(50), reminderSent: false,
  },
  {
    id: 'i5', type: 'found', title: 'Backpack', description: 'Brown backpack with two zips.',
    category: 'Bag / Backpack', location: 'Hostel Block', date: daysAgoISO(3), imageUri: null, icon: 'bag-handle-outline',
    ownerId: 'u2', createdAt: ago(70), stage: 'posted',
    questions: ['What is inside the front pocket?'],
    contactMethod: 'whatsapp', contactValue: '17234567', handover: { type: 'meetup', place: 'Canteen' },
    approvedClaimId: null, finderConfirmed: false, receiverConfirmed: false,
  },
  {
    id: 'i6', type: 'lost', title: 'Student ID Card', description: 'CST student ID card in a clear plastic holder.',
    category: 'ID Card', location: 'Academic Block', date: daysAgoISO(1), imageUri: null, icon: 'card-outline',
    ownerId: 'u4', createdAt: ago(18), stage: 'posted',
    questions: ['What is the student ID number printed on it?'],
    contactMethod: 'chat', contactValue: '', handover: null,
    approvedClaimId: null, finderConfirmed: false, receiverConfirmed: false,
  },
  {
    id: 'i7', type: 'found', title: 'Room Keys', description: 'Two keys on a red ring.',
    category: 'Keys', location: 'Parking Area', date: daysAgoISO(0), imageUri: null, icon: 'key-outline',
    ownerId: 'u3', createdAt: ago(3), stage: 'posted',
    questions: ['How many keys are on the ring?'],
    contactMethod: 'chat', contactValue: '', handover: { type: 'dropoff', place: 'Security Office' },
    approvedClaimId: null, finderConfirmed: false, receiverConfirmed: false,
  },
  {
    id: 'i8', type: 'found', title: 'Scientific Calculator', description: 'Casio scientific calculator, returned to its owner.',
    category: 'Books / Stationery', location: 'Academic Block', date: daysAgoISO(6), imageUri: null, icon: 'book-outline',
    ownerId: 'u1', createdAt: ago(150), stage: 'resolved',
    questions: ['What is written on the back?'],
    contactMethod: 'chat', contactValue: '', handover: { type: 'dropoff', place: 'Security Office' },
    approvedClaimId: 'c4', finderConfirmed: true, receiverConfirmed: true, firstConfirmAt: ago(120), resolvedAt: ago(110),
  },
];

export const SEED_CLAIMS = [
  {
    id: 'c1', code: 'CLM-001', itemId: 'i2', claimerId: 'u2', status: 'pending',
    answers: [
      { q: 'What colour is the case?', a: 'White' },
      { q: 'Is there any sticker or scratch on it?', a: 'A small scratch on the lid' },
    ],
    proofUri: null, handover: null, rejectReason: null, proofRequested: false, review: null, createdAt: ago(2),
  },
  {
    id: 'c2', code: 'CLM-002', itemId: 'i4', claimerId: 'u1', status: 'approved',
    answers: [{ q: 'Is there a sticker on the bottle? Which one?', a: 'Yes, a mountain sticker' }],
    proofUri: null, handover: null, rejectReason: null, proofRequested: false, review: null, createdAt: ago(80), resolvedAt: ago(60),
  },
  {
    id: 'c3', code: 'CLM-003', itemId: 'i5', claimerId: 'u1', status: 'rejected',
    answers: [{ q: 'What is inside the front pocket?', a: 'Some notebooks' }],
    proofUri: null, handover: null, rejectReason: 'Answers did not match.', proofRequested: false, review: null,
    createdAt: ago(60), resolvedAt: ago(48),
  },
  {
    id: 'c4', code: 'CLM-004', itemId: 'i8', claimerId: 'u2', status: 'approved',
    answers: [{ q: 'What is written on the back?', a: 'AW' }],
    proofUri: null, handover: null, rejectReason: null, proofRequested: false, review: null, createdAt: ago(140), resolvedAt: ago(130),
  },
];

export const SEED_CHATS = [
  {
    id: 'chat1', itemId: 'i2', claimId: 'c1', participantIds: ['u1', 'u2'],
    messages: [
      { id: 'm1', senderId: 'u2', text: 'Hi! Are the earbuds still available?', createdAt: ago(1.5) },
      { id: 'm2', senderId: 'u1', text: 'Yes, they are.', createdAt: ago(1.4) },
      { id: 'm3', senderId: 'u2', text: "Great! I'll come to the library later today.", createdAt: ago(1.3) },
    ],
  },
];

export const SEED_NOTIFICATIONS = [
  { id: 'n1', userId: 'u1', type: 'claim', title: 'Claim requested', body: 'Alex Wang wants to claim "Earbuds". Review their answers.', itemId: 'i2', claimId: 'c1', createdAt: ago(2), read: false },
  { id: 'n2', userId: 'u1', type: 'match', title: 'Possible match found!', body: 'A found item "Black Leather Wallet" may match your lost "Black Wallet".', itemId: 'i3', createdAt: ago(22), read: false },
  { id: 'n3', userId: 'u1', type: 'claim_result', title: 'Claim rejected', body: 'Your claim for "Backpack" was rejected.', itemId: 'i5', claimId: 'c3', createdAt: ago(48), read: true },
  { id: 'n4', userId: 'u1', type: 'message', title: 'New message from Alex Wang', body: "Great! I'll come to the library later today.", chatId: 'chat1', itemId: 'i2', createdAt: ago(1.3), read: false },
];

// Saved item ids per user id
export const SEED_SAVED = { u1: ['i3'], u2: [], u3: [], u4: [] };
