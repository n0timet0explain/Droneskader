// Brugerflade-tekster på dansk og engelsk. Indholdstekster ligger i data-filerne som { da, en }.
const UI = {
  title: { da: 'Droneskader', en: 'Drone Injuries' },
  layers: { da: 'Anatomiske lag', en: 'Anatomical layers' },
  skinOpacity: { da: 'Hudens gennemsigtighed', en: 'Skin transparency' },
  layerMissing: { da: 'Model mangler', en: 'Model missing' },
  layerReady: { da: 'Indlæst', en: 'Loaded' },
  munitions: { da: 'Ladninger · HE-FRAG', en: 'Munitions · HE-FRAG' },
  front: { da: 'Forfra', en: 'Front' },
  side: { da: 'Side', en: 'Side' },
  back: { da: 'Bagfra', en: 'Back' },
  top: { da: 'Top', en: 'Top' },
  introTitle: { da: 'Kropsmodel', en: 'Body model' },
  intro: {
    da: 'Drej modellen med venstre mus, zoom med hjulet, panorér med højre mus. Klik på kroppen for at se regionen og de strukturer, der ligger under huden.',
    en: 'Rotate with the left mouse button, zoom with the wheel, pan with the right button. Click the body to see the region and the structures beneath the skin.',
  },
  introNote: {
    da: 'Fragmentsimulering, sår og udrustning tilføjes i næste trin.',
    en: 'Fragment simulation, wounds and equipment are added in the next step.',
  },
  region: { da: 'Region', en: 'Region' },
  type: { da: 'Type', en: 'Type' },
  structures: { da: 'Strukturer under huden', en: 'Structures beneath the skin' },
  significance: { da: 'Betydning ved fragmentskade', en: 'Significance in fragment injury' },
  back_: { da: '← Tilbage', en: '← Back' },
  class: { da: 'Klasse', en: 'Class' },
  weight: { da: 'Vægt', en: 'Weight' },
  delivery: { da: 'Fremføring', en: 'Delivery' },
  fragments: { da: 'Fragmenter', en: 'Fragments' },
  source: { da: 'Kilde', en: 'Source' },
  uncertain: { da: 'Usikker post', en: 'Uncertain entry' },
  draft: { da: 'Kladde', en: 'Draft' },
  review: { da: 'Til review', en: 'In review' },
  valid: { da: 'Valideret', en: 'Validated' },
  left: { da: 'venstre', en: 'left' },
  right: { da: 'højre', en: 'right' },
};

const MONTHS = {
  da: ['JAN', 'FEB', 'MAR', 'APR', 'MAJ', 'JUN', 'JUL', 'AUG', 'SEP', 'OKT', 'NOV', 'DEC'],
  en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
};

let lang = 'da';
try {
  if (localStorage.getItem('lang') === 'en') lang = 'en';
} catch {}

const listeners = new Set();

export const getLang = () => lang;
export const t = (key) => UI[key]?.[lang] ?? key;
export const tr = (obj) => (obj && typeof obj === 'object' ? obj[lang] ?? obj.da : obj);
export const onLang = (fn) => listeners.add(fn);

export function setLang(next) {
  lang = next;
  try {
    localStorage.setItem('lang', next);
  } catch {}
  document.documentElement.lang = next;
  applyStatic();
  listeners.forEach((fn) => fn(next));
}

// Udfylder alle elementer med data-i18n
export function applyStatic() {
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
}

export function dtg(d = new Date()) {
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[lang][d.getMonth()]} ${d.getFullYear()}`;
}
