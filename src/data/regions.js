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

// Klassificering af et punkt på MakeHuman-kroppen (meter, A-stilling, ansigt mod +z).
// Grænserne er målt på modellen og er grove; de forfines når de indre lag er på plads.
// Torsoens midtlinje ligger ved z ≈ -0.115 (hænderne er foran kroppen i A-stillingen).
const Z0 = -0.115;

export function regionAt(p) {
  const ax = Math.abs(p.x);
  const z = p.z - Z0; // > 0 = forside
  const side = p.x > 0 ? 'left' : 'right'; // modellens venstre side er +x
  const sided = (id) => ({ id, side });

  if (p.y > 1.56) {
    if (z > 0.06 && p.y < 1.715 && ax < 0.075) {
      if (p.y > 1.655 && p.y < 1.7 && ax > 0.012 && ax < 0.058 && z > 0.1) return sided('oejne');
      return { id: 'ansigt' };
    }
    return { id: 'hoved' };
  }
  if (p.y > 1.48 && ax < 0.085) return { id: 'hals' };

  // Arme: udenfor torsoens bredde. Albuen ligger ved y ≈ 1.21.
  if (p.y > 0.95 && (ax > 0.25 || (p.y < 1.3 && ax > 0.19))) return sided(p.y > 1.21 ? 'overarm' : 'underarm');
  if (p.y > 1.26 && p.y < 1.42 && ax > 0.14 && Math.abs(z) < 0.07) return sided('aksil');
  if (p.y > 1.2) return { id: 'thorax' };
  if (p.y > 0.99) return { id: 'abdomen' };
  if (p.y > 0.8) return ax > 0.05 && z > 0 ? sided('lyske') : { id: 'lyske' };
  if (p.y > 0.47) return sided('laar');
  return sided('underben');
}
