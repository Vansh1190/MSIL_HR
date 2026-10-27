// ────────────────────────────────────────────────
// Home screen design tokens — teal glow + amber
// Presentation-only palette shared by Home.js and
// the Home service grid (components/Touchable.js).
// Screens other than Home keep using GlobalColor.
// ────────────────────────────────────────────────
export const HomeTheme = {
  tealGlow: '#3E9E90', // lifted teal — origin of the hero "glow"
  teal: '#2B8379', // brand teal
  tealDeep: '#12403A', // deep end of the hero gradient
  tealInk: '#0E2C28', // headings on light surfaces
  tealSoft: '#E4F0ED', // teal tint (icon chips, fills)
  amber: '#F2CB8A', // accent amber
  amberDeep: '#E3B063', // amber fills / strokes
  amberInk: '#7C5310', // text / icons on amber
  amberSoft: '#FBF2E1', // amber tint
  bg: '#F4F2EA', // screen background (warm cream)
  card: '#FFFFFF',
  line: '#E2E9E5',
  ink: '#142A27',
  muted: '#5C7370',
  onDark: '#FFFFFF',
  onDarkSoft: '#C7DFD9',
  onDarkFaint: '#9BC1B9',
};

// Two-tone accent cycle for the service tiles
export const TILE_ACCENTS = [
  {bg: '#E4F0ED', fg: '#1F6E63'},
  {bg: '#FBF2E1', fg: '#8A5F14'},
];

// Maruti Suzuki vision statements (static brand copy)
export const HOME_VISION = [
  'The Leader in the Indian Mobility Industry.',
  'Enhancing Customer Delight and Stakeholder Value.',
  'Driving a Sustainable Future.',
  'A Pride of India.',
];

export const getTimeGreeting = () => {
  const h = new Date().getHours();
  if (h < 5) return 'Working late,';
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
};
