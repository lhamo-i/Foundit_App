// All of Foundit's colours, sizes and shadows live here.
// Every screen imports from this file, so the app stays consistent.
// Change a colour here and it changes everywhere.

export const colors = {
  // Your four official colours
  background: '#FCF7DF', // Cream: screen backgrounds
  surface: '#C7D3DB', // Dusty Blue Grey: cards and secondary surfaces
  primary: '#A79A8A', // Warm Taupe: primary buttons and selected items
  text: '#3E3630', // Charcoal Brown: headings and main text

  // Variations of those colours
  surfaceLight: '#E3EAEE', // lighter blue-grey (image areas)
  inputBg: '#EEF2F4', // very light blue-grey (text inputs)
  border: '#B5C3CD', // slightly darker blue-grey (borders)
  borderLight: '#DDE5EA', // subtle dividers
  textMuted: '#5A5148', // softer brown for secondary text
  placeholder: '#7A7A78', // placeholder text in inputs
  white: '#FFFFFF',

  // Status colours (accessible red and green)
  lostBg: '#FBE4E1',
  lostText: '#9A1B13',
  foundBg: '#DDF1DF',
  foundText: '#1D6A34',
  danger: '#B3372F', // reject / delete buttons
  dangerText: '#FFFFFF',
  pendingBg: '#FFF1CC', // claim waiting for review
  pendingText: '#7A5A00',
  overlay: 'rgba(62, 54, 48, 0.45)', // dark layer behind pop-ups
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const typography = {
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  heading: { fontSize: 18, fontWeight: '700', color: colors.text },
  body: { fontSize: 15, color: colors.text },
  caption: { fontSize: 13, color: colors.textMuted },
};

export const shadow = {
  card: {
    shadowColor: '#3E3630',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  bar: {
    shadowColor: '#3E3630',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
};
