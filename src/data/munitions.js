// HE-FRAG-ladninger i scope. OFBCh/OFSP fra Confluence RAP-009 §5.1 og §5.3 (Defense Archives, aug. 2026).
// RGD-5 er ikke med i RAP-009 og bygger på åbne kilder. Vægte er indikative jf. RAP-009 §2.2.

const FPV = { da: 'FPV-monteret', en: 'FPV-mounted' };
const DROP = { da: 'Nedkastet fra drone', en: 'Dropped from drone' };
const IMPROVISED = { da: 'Improviseret: nedkastet eller FPV-monteret', en: 'Improvised: dropped or FPV-mounted' };
const UNSPEC = { da: 'Ikke specificeret i RAP-009', en: 'Not specified in RAP-009' };
const RINGS = { da: 'Laterale splintringe', en: 'Lateral fragmentation rings' };
const BALLS = { da: 'Stålkuglematrix', en: 'Steel ball matrix' };

export const MUNITIONS = [
  { id: 'ofbch-1.7', name: 'OFBCh-1.7', weight: '1,7 kg', delivery: FPV, fragments: UNSPEC, source: 'RAP-009 §5.1', note: { da: 'Set primo 2026.', en: 'Observed early 2026.' } },
  { id: 'ofbch-2', name: 'OFBCh-2', weight: '2 kg', delivery: FPV, fragments: RINGS, source: 'RAP-009 §5.1', note: { da: 'Flere alternative sprængstoffyldninger.', en: 'Several alternative explosive fillings.' } },
  { id: 'ofbch-2.5', name: 'OFBCh-2.5', weight: '3–3,75 kg', delivery: FPV, fragments: BALLS, source: 'RAP-009 §5.1', uncertain: true, note: { da: 'Opgivet vægt matcher ikke betegnelsen. Flere varianter.', en: 'Stated weight does not match the designation. Several variants.' } },
  { id: 'ofbch-3', name: 'OFBCh-3', weight: '3 kg', delivery: FPV, fragments: UNSPEC, source: 'RAP-009 §5.1', note: { da: 'Set primo 2024. Skæres ofte over på midten for at reducere vægt.', en: 'Observed early 2024. Often cut in half to save weight.' } },
  { id: 'ofbch-4', name: 'OFBCh-4', weight: '4 kg', delivery: FPV, fragments: UNSPEC, source: 'RAP-009 §5.1', note: { da: 'Observeret primo 2026.', en: 'Observed early 2026.' } },
  { id: 'ofsp-0.5', name: 'OFSP-0.5', weight: '0,5 kg', delivery: DROP, fragments: UNSPEC, source: 'RAP-009 §5.3', note: { da: '48 mm. I brug siden primo 2022.', en: '48 mm. In use since early 2022.' } },
  { id: 'ofsp-0.8', name: 'OFSP-0.8', weight: '0,8 kg', delivery: DROP, fragments: UNSPEC, source: 'RAP-009 §5.3', note: { da: '48 mm. Ofte med standoff-sonde, detonerer over jorden.', en: '48 mm. Often with standoff probe, detonates above ground.' } },
  { id: 'ofsp-1.7', name: 'OFSP-1.7', weight: '1,7 kg', delivery: DROP, fragments: UNSPEC, source: 'RAP-009 §5.3', note: { da: '55 mm.', en: '55 mm.' } },
  { id: 'ofsp-2.5', name: 'OFSP-2.5', weight: '2,5 kg', delivery: DROP, fragments: RINGS, source: 'RAP-009 §5.3', note: { da: '60 mm.', en: '60 mm.' } },
  {
    id: 'rgd-5',
    name: 'RGD-5',
    weight: '0,31 kg',
    delivery: IMPROVISED,
    fragments: { da: 'Tyndt stålhylster med fragmentationsforing. Mange små, lette fragmenter.', en: 'Thin steel body with fragmentation liner. Many small, light fragments.' },
    source: { da: 'Åbne kilder (ikke RAP-009)', en: 'Open sources (not RAP-009)' },
    note: { da: 'Sovjetisk/russisk offensiv håndgranat, ca. 110 g TNT. Brugt som improviseret droneammunition.', en: 'Soviet/Russian offensive hand grenade, approx. 110 g TNT. Used as improvised drone munition.' },
  },
];
