// SAMPLE DATA for Stage 2. In Stage 3/4 claims live in Firestore and answers are
// checked by a Cloud Function, so the correct answers are never on the phone.

// The pretend signed-in user (replaced by the real Firebase user in Stage 3).
export const SAMPLE_USER = {
  name: 'Tshering Lhamo',
  id: '02240189',
  email: '02240189.cst@rub.edu.bt',
  role: 'Student',
};

// The private questions a claimant sees for each Found item (item id -> questions).
// Only the QUESTIONS are shown to claimants, never the answers.
export const SAMPLE_QUESTIONS = {
  '2': ['What brand are the earbuds?', 'Is there any sticker or scratch on the case?'],
  '4': ['What brand is the bottle?', 'What is written or printed on it?'],
  '6': ['How many keys are on the ring?', 'What is attached to the key ring?'],
};

export const DEFAULT_QUESTIONS = ['Describe a detail only the owner would know.', 'Where exactly did you lose it?'];

export const SAMPLE_CLAIMS = [
  {
    id: 'CLM-001',
    itemId: '2',
    claimantName: 'Sonam Choden',
    claimantId: '02240155',
    claimantIsMe: false,
    answers: [
      { question: 'What brand are the earbuds?', answer: 'Apple' },
      { question: 'Is there any sticker or scratch on the case?', answer: 'A small blue sticker on the lid' },
    ],
    evidence: [],
    status: 'pending',
    rejectionReason: '',
    proofRequested: false,
    appealText: '',
    staffNote: '',
    finalDecision: false,
    submittedLabel: '2m ago',
  },
  {
    id: 'CLM-002',
    itemId: '6',
    claimantName: 'Karma Wangchuk',
    claimantId: '02240201',
    claimantIsMe: false,
    answers: [
      { question: 'How many keys are on the ring?', answer: 'Three' },
      { question: 'What is attached to the key ring?', answer: 'A small red tag' },
    ],
    evidence: [],
    status: 'pending',
    rejectionReason: '',
    proofRequested: false,
    appealText: '',
    staffNote: '',
    finalDecision: false,
    submittedLabel: '1h ago',
  },
  {
    id: 'CLM-003',
    itemId: '4',
    claimantName: SAMPLE_USER.name,
    claimantId: SAMPLE_USER.id,
    claimantIsMe: true,
    answers: [
      { question: 'What brand is the bottle?', answer: 'Milton' },
      { question: 'What is written or printed on it?', answer: 'Nothing' },
    ],
    evidence: [],
    status: 'rejected',
    rejectionReason: 'Answers did not match.',
    proofRequested: false,
    appealText: '',
    staffNote: '',
    finalDecision: false,
    submittedLabel: '2d ago',
  },
  {
    id: 'CLM-004',
    itemId: '4',
    claimantName: 'Pema Zam',
    claimantId: '02240170',
    claimantIsMe: false,
    answers: [
      { question: 'What brand is the bottle?', answer: 'Hydro Flask' },
      { question: 'What is written or printed on it?', answer: 'My name is inside the lid' },
    ],
    evidence: [],
    status: 'disputed',
    rejectionReason: 'Answers did not match.',
    proofRequested: false,
    appealText:
      'The bottle is mine. I bought it last month and my name is written inside the lid.',
    staffNote: '',
    finalDecision: false,
    submittedLabel: '1d ago',
  },
];
