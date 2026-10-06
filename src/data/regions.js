// Kropsregioner med de strukturer, der ligger under huden.
// Status: kladde. Skal valideres af fagperson.

export const TYPES = {
  head: { da: 'Hoved/ansigt', en: 'Head/face' },
  junctional: { da: 'Junktionel', en: 'Junctional' },
  torso: { da: 'Torso', en: 'Torso' },
  limb: { da: 'Ekstremitet', en: 'Extremity' },
};

export const REGIONS = {
  hoved: {
    name: { da: 'Kranie / hjerne', en: 'Skull / brain' },
    type: 'head',
    structures: ['Os frontale, parietale, occipitale, temporale', { da: 'Hjerne (cerebrum, cerebellum)', en: 'Brain (cerebrum, cerebellum)' }, 'A. temporalis superficialis', { da: 'Sinus durae matris', en: 'Dural venous sinuses' }],
    significance: { da: 'Selv små fragmenter kan penetrere kraniet og give penetrerende hjerneskade. Hjelmen dækker kun en del af kraniet.', en: 'Even small fragments can penetrate the skull and cause penetrating brain injury. The helmet covers only part of the skull.' },
  },
  ansigt: {
    name: { da: 'Ansigt', en: 'Face' },
    type: 'head',
    structures: ['Maxilla, mandibula, os zygomaticum', 'A. facialis', { da: 'Mundhule, svælg (luftvej)', en: 'Oral cavity, pharynx (airway)' }, 'N. facialis'],
    significance: { da: 'Fragmenter i ansigt og kæbe giver blødning og hævelse, der kan lukke luftvejen.', en: 'Fragments to the face and jaw cause bleeding and swelling that can obstruct the airway.' },
  },
  oejne: {
    name: { da: 'Øjne', en: 'Eyes' },
    type: 'head',
    structures: ['Bulbus oculi', 'Orbita', 'N. opticus'],
    significance: { da: 'Små fragmenter penetrerer øjet let. Øjenskader er meget hyppige ved splintvåben.', en: 'Small fragments easily penetrate the eye. Eye injuries are very common with fragmentation weapons.' },
  },
  hals: {
    name: { da: 'Hals', en: 'Neck' },
    type: 'junctional',
    structures: ['A. carotis communis', 'V. jugularis interna', 'Trachea, larynx', 'N. vagus', { da: 'Halshvirvler og rygmarv', en: 'Cervical spine and spinal cord' }],
    significance: { da: 'Store kar og luftvej ligger overfladisk. Kan ikke afklemmes med tourniquet.', en: 'Major vessels and the airway lie superficially. Cannot be controlled with a tourniquet.' },
  },
  aksil: {
    name: { da: 'Armhule', en: 'Axilla' },
    type: 'junctional',
    structures: ['A. og v. axillaris', 'Plexus brachialis', { da: 'Lungespids (apex)', en: 'Lung apex' }],
    significance: { da: 'Ligger i hullet mellem vestens plader og armen. A. axillaris kan ikke afklemmes med tourniquet.', en: 'Lies in the gap between body armour plates and the arm. The axillary artery cannot be controlled with a tourniquet.' },
  },
  thorax: {
    name: { da: 'Brystkasse', en: 'Chest' },
    type: 'torso',
    structures: [{ da: 'Lunger', en: 'Lungs' }, { da: 'Hjerte', en: 'Heart' }, 'Aorta, v. cava superior', 'Costae, sternum'],
    significance: { da: 'Fragmenter kan give pneumothorax, hæmothorax og hjerteskade. Trykbølgen kan give blast-lunge uden ydre sår.', en: 'Fragments can cause pneumothorax, haemothorax and cardiac injury. The blast wave can cause blast lung without external wounds.' },
  },
  abdomen: {
    name: { da: 'Mave', en: 'Abdomen' },
    type: 'torso',
    structures: [{ da: 'Lever, milt', en: 'Liver, spleen' }, { da: 'Tyndtarm, tyktarm', en: 'Small and large bowel' }, { da: 'Nyrer (bagtil)', en: 'Kidneys (posterior)' }, 'Aorta abdominalis, v. cava inferior'],
    significance: { da: 'Indre blødning fra lever, milt og store kar kan ikke stoppes i felten. Tarmen er sårbar for trykbølgen.', en: 'Internal bleeding from liver, spleen and major vessels cannot be stopped in the field. The bowel is vulnerable to blast.' },
  },
  lyske: {
    name: { da: 'Lyske / bækken', en: 'Groin / pelvis' },
    type: 'junctional',
    structures: ['A. og v. femoralis', 'A. iliaca externa', { da: 'Bækken (os coxae, sacrum)', en: 'Pelvis (hip bone, sacrum)' }, { da: 'Blære, endetarm, kønsorganer', en: 'Bladder, rectum, genitalia' }],
    significance: { da: 'Junktionelt område hvor tourniquet ikke kan bruges. Bækkenfraktur kan give stor indre blødning.', en: 'Junctional area where a tourniquet cannot be applied. Pelvic fracture can cause major internal bleeding.' },
  },
  overarm: {
    name: { da: 'Overarm', en: 'Upper arm' },
    type: 'limb',
    structures: ['A. brachialis', 'N. medianus, ulnaris, radialis', 'Humerus'],
    significance: { da: 'Arteriel blødning fra a. brachialis. Nerveskader er hyppige.', en: 'Arterial bleeding from the brachial artery. Nerve injuries are common.' },
  },
  underarm: {
    name: { da: 'Underarm / hånd', en: 'Forearm / hand' },
    type: 'limb',
    structures: ['A. radialis, a. ulnaris', 'Radius, ulna', { da: 'Sener og håndens knogler', en: 'Tendons and hand bones' }],
    significance: { da: 'Ofte ramt fordi armene er ubeskyttede og løftet. Mange små sår, sene- og nerveskader.', en: 'Often hit because the arms are unprotected and raised. Many small wounds, tendon and nerve injuries.' },
  },
  laar: {
    name: { da: 'Lår', en: 'Thigh' },
    type: 'limb',
    structures: ['A. og v. femoralis', 'A. profunda femoris', 'N. ischiadicus', 'Femur'],
    significance: { da: 'A. femoralis kan bløde personen ud på få minutter. Traumatisk amputation ved meget tæt detonation.', en: 'The femoral artery can exsanguinate within minutes. Traumatic amputation at very close detonation.' },
  },
  underben: {
    name: { da: 'Underben / fod', en: 'Lower leg / foot' },
    type: 'limb',
    structures: ['A. tibialis anterior og posterior', 'Tibia, fibula', { da: 'Fodens knogler', en: 'Foot bones' }],
    significance: { da: 'Udsat ved detonation tæt på jorden. Åbne frakturer og amputation.', en: 'Exposed in detonations close to the ground. Open fractures and amputation.' },
  },
};

// Z-Anatomys hudregioner (anatomisk nomenklatur) -> kliniske regioner i værktøjet
const SKIN_MAP = {
  hoved: ['Frontal region', 'Mastoid region', 'Occipital region', 'Parietal region', 'Temporal region', 'Auricular region', 'Cavity of concha', 'Concha of auricle', 'Cymba conchae', 'Anterior notch of auricle', 'Antihelix', 'Antitragus', 'Apex of auricle', 'Auricular tubercle', 'Crura of antihelix', 'Eminentia conchae', 'Eminentia fossae triangularis', 'Eminentia scaphae', 'Fossa antihelica', 'Helix', 'Intertragic incisure', 'Lobule of auricle', 'Scapha', 'Tragus', 'Triangular fossa', 'Posterior auricular groove'],
  oejne: ['Orbital region'],
  ansigt: ['Eyebrow', 'Nasal region', 'Oral region', 'Angle of mouth', 'Labial commissure', 'Philtrum', 'Tubercle of upper lip', 'Buccal region', 'Infra-orbital region', 'Mental region', 'Mentolabial sulcus', 'Parotideomasseteric region', 'Zygomatic region', 'Nasolabial sulcus'],
  hals: ['Posterior region of neck', 'Lateral region of neck', 'Greater supraclavicular fossa', 'Lesser supraclavicular fossa', 'Submandibular triangle', 'Submental triangle', 'Carotid triangle', 'Muscular triangle', 'Sternocleidomastoid region'],
  thorax: ['Pectoral region', 'Inframammary region', 'Mammary region', 'Infraclavicular fossa', 'Presternal region', 'Deltopectoral triangle', 'Scapular region', 'Interscapular region', 'Infrascapular region', 'Triangle of auscultation', 'Vertebral region'],
  aksil: ['Lateral region of thorax'],
  abdomen: ['Epigastric region', 'Umbilical region', 'Umbilicus', 'Hypochondriac region', 'Hypogastric region', 'Lateral region of abdomen', 'Lumbar region'],
  lyske: ['Inguinal region', 'Femoral triangle', 'Urogenital region', 'Anal region', 'Sacral region', 'Hip region', 'Gluteal region', 'Gluteal fold'],
  overarm: ['Deltoid region', 'Anterior region of arm', 'Posterior region of arm', 'Lateral bicipital groove', 'Medial bicipital groove'],
  underarm: ['Anterior region of elbow', 'Posterior region of elbow', 'Cubital fossa', 'Anterior region of forearm', 'Posterior region of forearm', 'Lateral border of forearm', 'Medial border of forearm', 'Anterior region of wrist', 'Posterior region of wrist', 'Radial foveola', 'Palm', 'Dorsum of hand', 'Palmar surfaces of digits of hand', 'Dorsal surfaces of digits of hand', 'Nail plate', 'Perionyx'],
  laar: ['Anterior region of thigh', 'Posterior region of thigh', 'Anterior region of knee', 'Posterior region of knee', 'Popliteal fossa'],
  underben: ['Anterior region of leg', 'Posterior region of leg', 'Lateral malleolus', 'Medial malleolus', 'Anterior region of ankle', 'Lateral retromalleolar region', 'Medial retromalleolar region', 'Sole', 'Lateral part of longitudinal arch of foot', 'Medial part of longitudinal arch of foot', 'Proximal transverse arch of foot', 'Distal transverse arch of foot', 'Metatarsal region', 'Hallucial eminence', 'Heel region', 'Dorsum of foot', 'Lateral border of foot', 'Medial border of foot', 'Dorsal surfaces of digits of foot', 'Nail plate (foot)', 'Perionyx (foot)', 'Plantar surfaces of digits of foot'],
};
const BY_NAME = new Map(Object.entries(SKIN_MAP).flatMap(([id, names]) => names.map((n) => [n, id])));

// Klinisk region for en hudstruktur. Thorax' sideflade regnes som armhule øverst (højde over ~1,25 m).
export function regionForSkin(name, point) {
  let id = BY_NAME.get(name);
  if (id === 'aksil' && point.y < 1.25) id = 'thorax';
  if (!id && /^(eyeball|cornea|sclera|iris|pupil)/i.test(name)) id = 'oejne';
  return id || null;
}
