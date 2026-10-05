import * as THREE from 'three';

const skin = new THREE.MeshStandardMaterial({ color: 0xc9b7a3, roughness: 0.75 });
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.3 });

const UP = new THREE.Vector3(0, 1, 0);

// Kapsel orienteret mellem to punkter
export function limb(a, b, r, mat) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, dir.length(), 8, 16), mat);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(UP, dir.clone().normalize());
  return m;
}

const v = (x, y, z = 0) => new THREE.Vector3(x, y, z);

// Led-positioner (A-stilling, personen kigger mod +z)
export const J = {
  shoulder: v(0.2, 1.4),
  elbow: v(0.3, 1.13),
  wrist: v(0.36, 0.88, 0.02),
  hand: v(0.38, 0.8, 0.03),
  hip: v(0.09, 0.9),
  knee: v(0.11, 0.5, 0.01),
  ankle: v(0.12, 0.09),
};

export function buildBody() {
  const group = new THREE.Group();
  const parts = [];
  const add = (mesh, part) => {
    mesh.userData.part = part;
    mesh.castShadow = true;
    group.add(mesh);
    parts.push(mesh);
    return mesh;
  };

  // Hoved
  const head = add(new THREE.Mesh(new THREE.SphereGeometry(0.105, 32, 24), skin), 'head');
  head.scale.set(0.92, 1.1, 1.0);
  head.position.set(0, 1.69, 0);
  for (const s of [-1, 1]) {
    const eye = add(new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 8), eyeMat), 'head');
    eye.position.set(0.035 * s, 1.71, 0.095);
  }
  const nose = add(new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.03, 12), skin), 'head');
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, 1.665, 0.11);

  add(limb(v(0, 1.46), v(0, 1.58), 0.055, skin), 'neck');

  const thorax = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.18, 8, 24), skin), 'thorax');
  thorax.scale.set(1.25, 1, 0.72);
  thorax.position.set(0, 1.27, 0);

  const abdomen = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.08, 8, 24), skin), 'abdomen');
  abdomen.scale.set(1.2, 1, 0.78);
  abdomen.position.set(0, 1.02, 0);

  const pelvis = add(new THREE.Mesh(new THREE.SphereGeometry(0.14, 24, 16), skin), 'pelvis');
  pelvis.scale.set(1.25, 0.75, 0.85);
  pelvis.position.set(0, 0.88, 0);

  for (const s of [-1, 1]) {
    const m = (p) => v(p.x * s, p.y, p.z);
    add(limb(m(J.shoulder), m(J.elbow), 0.048, skin), 'upperArm');
    add(limb(m(J.elbow), m(J.wrist), 0.04, skin), 'forearm');
    const hand = add(new THREE.Mesh(new THREE.SphereGeometry(0.048, 16, 12), skin), 'forearm');
    hand.scale.set(0.6, 1.2, 0.9);
    hand.position.copy(m(J.hand));
    add(limb(m(J.hip), m(J.knee), 0.075, skin), 'thigh');
    add(limb(m(J.knee), m(J.ankle), 0.052, skin), 'shin');
    const foot = add(new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.07, 0.24), skin), 'shin');
    foot.position.set(0.12 * s, 0.04, 0.05);
  }

  return { group, parts };
}

// Oversæt et ramt punkt på en kropsdel til en klinisk region
export function regionFor(part, p) {
  const ax = Math.abs(p.x);
  switch (part) {
    case 'head':
      if (p.z > 0.04 && p.y < 1.74) {
        if (p.y > 1.685 && p.y < 1.74 && ax < 0.07 && p.z > 0.06) return 'oejne';
        return 'ansigt';
      }
      return 'hoved';
    case 'neck':
      return 'hals';
    case 'thorax':
      return ax > 0.15 && p.y > 1.26 ? 'aksil' : 'thorax';
    case 'upperArm':
      return p.y > 1.3 && ax < 0.24 ? 'aksil' : 'ekstremitet_arm';
    case 'forearm':
      return 'ekstremitet_underarm';
    case 'abdomen':
      return 'abdomen';
    case 'pelvis':
      return 'lyske';
    case 'thigh':
      return p.y > 0.78 && ax < 0.12 ? 'lyske' : 'ekstremitet_ben';
    case 'shin':
      return 'ekstremitet_underben';
  }
  return null;
}
