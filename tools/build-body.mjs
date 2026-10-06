// Bygger kropsmodellen: MakeHuman-basismesh (CC0) + mande-targets (CC0) -> GLB i meter.
// Kun gruppen "body" beholdes; hjælpegeometri (tøj, øjenvipper, led) fjernes.
// Kør: node tools/build-body.mjs
import { readFileSync, mkdirSync } from 'node:fs';
import { Document, NodeIO } from '@gltf-transform/core';

const SRC = 'assets/models/makehuman-base.obj';
const OUT = 'src/assets/body.glb';
const HEIGHT_M = 1.78; // typisk voksen mand

// MakeHuman-makromodel: base + race/køn/alder-target + muskel-target med vægt
const TARGETS = [
  ['assets/models/targets/caucasian-male-young.target', 1.0],
  ['assets/models/targets/universal-male-young-maxmuscle-averageweight.target', 0.35],
];

const v = [], vt = [], faces = [];
let group = '';
for (const line of readFileSync(SRC, 'utf8').split('\n')) {
  const p = line.trim().split(/\s+/);
  if (p[0] === 'v') v.push(p.slice(1, 4).map(Number));
  else if (p[0] === 'vt') vt.push(p.slice(1, 3).map(Number));
  else if (p[0] === 'g') group = p[1];
  else if (p[0] === 'f' && group === 'body') faces.push(p.slice(1).map((s) => s.split('/').map((n) => parseInt(n, 10) - 1)));
}

for (const [file, w] of TARGETS) {
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    if (!line || line[0] === '#') continue;
    const [i, dx, dy, dz] = line.trim().split(/\s+/).map(Number);
    v[i][0] += w * dx;
    v[i][1] += w * dy;
    v[i][2] += w * dz;
  }
}

// Trianguler og indeksér unikke (position, uv)-par; normaler glattes pr. position
const key = new Map();
const pos = [], uv = [], src = [], idx = [];
const tris = [];
for (const f of faces) for (let i = 1; i < f.length - 1; i++) tris.push([f[0], f[i], f[i + 1]]);
for (const tri of tris) {
  for (const [vi, ti] of tri) {
    const k = vi * 1e6 + ti;
    if (!key.has(k)) {
      key.set(k, src.length);
      src.push(vi);
      pos.push(...v[vi]);
      uv.push(vt[ti][0], 1 - vt[ti][1]);
    }
    idx.push(key.get(k));
  }
}

const acc = new Float64Array(v.length * 3);
for (const tri of tris) {
  const [a, b, c] = tri.map(([vi]) => v[vi]);
  const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
  for (const [vi] of tri) for (let k = 0; k < 3; k++) acc[vi * 3 + k] += n[k];
}
const nrm = [];
for (const vi of src) {
  const x = acc[vi * 3], y = acc[vi * 3 + 1], z = acc[vi * 3 + 2];
  const l = Math.hypot(x, y, z) || 1;
  nrm.push(x / l, y / l, z / l);
}

// Skalér til meter, fødder på y = 0, centreret i x/z
const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < pos.length; i += 3)
  for (let k = 0; k < 3; k++) {
    min[k] = Math.min(min[k], pos[i + k]);
    max[k] = Math.max(max[k], pos[i + k]);
  }
const s = HEIGHT_M / (max[1] - min[1]);
const cx = (min[0] + max[0]) / 2, cz = (min[2] + max[2]) / 2;
for (let i = 0; i < pos.length; i += 3) {
  pos[i] = (pos[i] - cx) * s;
  pos[i + 1] = (pos[i + 1] - min[1]) * s;
  pos[i + 2] = (pos[i + 2] - cz) * s;
}

const doc = new Document();
const buf = doc.createBuffer();
const accessor = (type, arr) => doc.createAccessor().setType(type).setArray(arr).setBuffer(buf);
const prim = doc
  .createPrimitive()
  .setAttribute('POSITION', accessor('VEC3', new Float32Array(pos)))
  .setAttribute('NORMAL', accessor('VEC3', new Float32Array(nrm)))
  .setAttribute('TEXCOORD_0', accessor('VEC2', new Float32Array(uv)))
  .setIndices(accessor('SCALAR', new Uint32Array(idx)))
  .setMaterial(doc.createMaterial('skin'));
const node = doc.createNode('skin').setMesh(doc.createMesh('skin').addPrimitive(prim)).setExtras({ layer: 'skin' });
doc.createScene().addChild(node);

mkdirSync('src/assets', { recursive: true });
await new NodeIO().write(OUT, doc);
console.log(`${OUT}: ${tris.length} trekanter, ${src.length} hjørner, skala ${s.toFixed(4)}`);
