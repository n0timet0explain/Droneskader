import * as THREE from 'three';
import { J, limb } from './body.js';

// protection: illustrativ sandsynlighed for at et fragment stoppes (ikke ballistiske data)
export const GEAR = {
  helmet: { name: 'Hjelm', protection: 0.9, color: 0x5b6142 },
  glasses: { name: 'Ballistiske briller', protection: 0.9, color: 0x1d2a33 },
  collar: { name: 'Halsbeskyttelse', protection: 0.7, color: 0x6b6a4c },
  plates: { name: 'Skudsikker vest (plader + blød panser)', protection: 0.95, color: 0x6e6d4f },
  sidePlates: { name: 'Sideplader', protection: 0.95, color: 0x5f5e43 },
  shoulders: { name: 'Skulderbeskyttelse', protection: 0.6, color: 0x6b6a4c },
  groin: { name: 'Skridtbeskytter', protection: 0.7, color: 0x6b6a4c },
  kneePads: { name: 'Knæbeskyttere', protection: 0.3, color: 0x3c3c34 },
  gloves: { name: 'Handsker', protection: 0.1, color: 0x3c3c34 },
};

export const PRESETS = {
  none: { name: 'Ingen', items: [] },
  light: { name: 'Let', items: ['helmet', 'glasses'] },
  standard: { name: 'Infanterist', items: ['helmet', 'glasses', 'plates', 'kneePads', 'gloves'] },
  full: { name: 'Fuld beskyttelse', items: Object.keys(GEAR) },
};

export function buildGear() {
  const groups = {};
  const meshes = [];

  const make = (key, build) => {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: GEAR[key].color,
      roughness: 0.85,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 1,
    });
    for (const m of build(mat)) {
      m.userData.gear = key;
      m.castShadow = true;
      g.add(m);
      meshes.push(m);
    }
    g.visible = false;
    groups[key] = g;
  };

  make('helmet', (mat) => {
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.125, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat);
    dome.scale.set(0.95, 1.05, 1.05);
    dome.position.set(0, 1.73, 0);
    // Nakke/side-skørt, åbent fortil
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.122, 0.07, 32, 1, true, Math.PI / 3, (Math.PI * 4) / 3), mat);
    skirt.position.set(0, 1.69, 0);
    return [dome, skirt];
  });

  make('glasses', (mat) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.112, 0.035, 24, 1, true, -Math.PI / 3, (Math.PI * 2) / 3), mat);
    m.position.set(0, 1.71, 0);
    return [m];
  });

  make('collar', (mat) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.08, 24, 1, true), mat);
    m.position.set(0, 1.52, 0);
    return [m];
  });

  make('plates', (mat) => {
    const front = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.3, 0.025), mat);
    front.position.set(0, 1.28, 0.125);
    const back = front.clone();
    back.position.z = -0.125;
    const cummerbund = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.15, 32, 1, true), mat);
    cummerbund.scale.set(1.22, 1, 0.82);
    cummerbund.position.set(0, 1.12, 0);
    const straps = [-1, 1].map((s) => {
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.25), mat);
      st.position.set(0.09 * s, 1.44, 0);
      return st;
    });
    return [front, back, cummerbund, ...straps];
  });

  make('sidePlates', (mat) =>
    [-1, 1].map((s) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.15, 0.15), mat);
      m.position.set(0.2 * s, 1.15, 0);
      return m;
    })
  );

  make('shoulders', (mat) =>
    [-1, 1].map((s) => {
      const a = new THREE.Vector3(J.shoulder.x * s, J.shoulder.y + 0.02, 0);
      const b = new THREE.Vector3(J.elbow.x * s, J.elbow.y, 0).lerp(a, 0.45);
      const m = limb(a, b, 0.064, mat);
      m.geometry = new THREE.CylinderGeometry(0.064, 0.062, a.distanceTo(b), 20, 1, true);
      return m;
    })
  );

  make('groin', (mat) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.15, 0.02), mat);
    m.position.set(0, 0.8, 0.12);
    m.rotation.x = -0.15;
    return [m];
  });

  make('kneePads', (mat) =>
    [-1, 1].map((s) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.086, 0.086, 0.11, 20, 1, true, -Math.PI / 2, Math.PI), mat);
      m.position.set(J.knee.x * s, J.knee.y, J.knee.z);
      return m;
    })
  );

  make('gloves', (mat) =>
    [-1, 1].map((s) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.054, 16, 12), mat);
      m.scale.set(0.62, 1.22, 0.92);
      m.position.set(J.hand.x * s, J.hand.y, J.hand.z);
      return m;
    })
  );

  return { groups, meshes };
}
