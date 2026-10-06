// Bygger src/assets/anatomy.glb fra Z-Anatomy (CC BY-SA 4.0, https://github.com/LluisV/Z-Anatomy).
// Seks systemer samles i ét koordinatsystem (meter, y op, ansigt mod +z), etiketter og hjælpeobjekter fjernes,
// geometrien forenkles og komprimeres med meshopt.
//
// Kør: node tools/build-anatomy.mjs <sti til Z-Anatomy/Resources/Models/FBX>
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { NodeIO, getBounds } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { flatten, mergeDocuments, prune, dedup, weld, simplify, quantize } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';

const FBX_DIR = process.argv[2];
const OUT = 'src/assets/anatomy.glb';
const OUT_DESC = 'src/data/descriptions.json';
if (!FBX_DIR || !existsSync(FBX_DIR)) {
  console.error('Brug: node tools/build-anatomy.mjs <Z-Anatomy/Resources/Models/FBX>');
  process.exit(1);
}

// system -> lag og forenklingsgrad (andel af trekanter der bevares)
const SYSTEMS = [
  { file: 'Regions of human body100', layer: 'skin', ratio: 1 },
  { file: 'MuscularSystem100', layer: 'muscle', ratio: 0.3 },
  { file: 'CardioVascular41', layer: 'vessels', ratio: 0.3 },
  { file: 'NervousSystem100', layer: 'nerves', ratio: 0.25 },
  { file: 'VisceralSystem100', layer: 'organs', ratio: 0.4 },
  { file: 'SkeletalSystem100', layer: 'skeleton', ratio: 0.3 },
];

// .j/.i = etiketter, .o… = muskelfæster tegnet på knogler, fascier og hår skjuler det underliggende
const EXCLUDE = [/\.[ji]$/, /\.o\d*[lr]?$/, /fascia/i, /hairs?\b/i, /eyelash/i];
// Øjets overflade hører til det ydre billede og vises sammen med huden
const EYE = /^(eyeball|cornea|sclera|iris|pupil)/i;
const HEART = /heart|atrium|atrial|ventricle|ventricular|valve|cusp|myocard|pericard|auricle|trabeculae carneae|papillary|chordae/i;
const VEIN = /\bvein|\bvenous|\bsinus\b|vena |venae/i;

const require = createRequire(import.meta.url);
const FBX2GLTF = require.resolve(`fbx2gltf/bin/${process.platform === 'linux' ? 'Linux/FBX2glTF' : process.platform === 'darwin' ? 'Darwin/FBX2glTF' : 'Windows_NT/FBX2glTF.exe'}`);

function countTris(root) {
  let t = 0;
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) t += (p.getIndices()?.getCount() ?? 0) / 3;
  return Math.round(t);
}

await Promise.all([MeshoptEncoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const cache = join(tmpdir(), 'droneskader-anatomy');
mkdirSync(cache, { recursive: true });

let out = null;
for (const sys of SYSTEMS) {
  const glb = join(cache, `${sys.file}.glb`);
  if (!existsSync(glb)) execFileSync(FBX2GLTF, ['--binary', '--input', join(FBX_DIR, `${sys.file}.fbx`), '--output', glb.replace(/\.glb$/, '')]);
  const doc = await io.read(glb);
  const root = doc.getRoot();

  // Bag hierarkiet ind i hver mesh, så alle noder ligger direkte i scenen
  await doc.transform(flatten());
  let kept = 0;
  for (const node of root.listNodes()) {
    const mesh = node.getMesh();
    const name = node.getName();
    if (!mesh) continue;
    if (EXCLUDE.some((re) => re.test(name))) {
      node.dispose();
      continue;
    }
    const side = /\.l$/.test(name) ? 'l' : /\.r$/.test(name) ? 'r' : '';
    const clean = name.replace(/\.[lr]$/, '').replace(/'+$/, '');
    let layer = sys.layer, kind = '';
    if (layer === 'nerves' && EYE.test(clean)) {
      layer = 'skin';
      kind = 'eye';
    } else if (layer === 'vessels') {
      if (HEART.test(clean)) layer = 'organs';
      else kind = VEIN.test(clean) ? 'vein' : 'artery';
    }
    node.setExtras({ layer, kind, name: clean, side });
    for (const prim of mesh.listPrimitives()) {
      prim.setMaterial(null);
      prim.setAttribute('TEXCOORD_0', null);
    }
    kept++;
  }
  // Tomme grupper fjernes
  for (const node of root.listNodes()) if (!node.getMesh() && node.listChildren().length === 0) node.dispose();

  const before = countTris(root);
  await doc.transform(prune(), weld());
  if (sys.ratio < 1) await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: sys.ratio, error: sys.error ?? 0.002 }));
  console.log(`${sys.file}: ${kept} strukturer, ${before} → ${countTris(root)} trekanter`);

  if (!out) out = doc;
  else mergeDocuments(out, doc);
}

// Saml alle scener under én rodnode
const root = out.getRoot();
const scene = root.listScenes()[0];
const anatomy = out.createNode('anatomy');
for (const s of root.listScenes()) {
  for (const n of s.listChildren()) {
    s.removeChild(n);
    anatomy.addChild(n);
  }
  if (s !== scene) s.dispose();
}
scene.addChild(anatomy);
for (const b of root.listBuffers().slice(1)) {
  for (const a of root.listAccessors()) if (a.getBuffer() === b) a.setBuffer(root.listBuffers()[0]);
  b.dispose();
}

// Orientering: Z-Anatomy vender ansigtet mod -y/+y afhængigt af eksport; ret så ansigtet peger mod +z
const face = root.listNodes().find((n) => n.getExtras().name === 'Frontal region');
const occ = root.listNodes().find((n) => n.getExtras().name === 'Occipital region');
const fz = getBounds(face).min[2] + getBounds(face).max[2];
const oz = getBounds(occ).min[2] + getBounds(occ).max[2];
if (fz < oz) anatomy.setRotation([0, 1, 0, 0]); // 180° om y

await out.transform(dedup(), prune(), quantize());
out.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.QUANTIZE });

const tris = countTris(root);
const b = getBounds(scene);
await io.write(OUT, out);
console.log(`${OUT}: ${root.listNodes().length} noder, ${Math.round(tris)} trekanter, bounds ${b.min.map((v) => v.toFixed(2))} → ${b.max.map((v) => v.toFixed(2))}`);

// Første afsnit af Z-Anatomys beskrivelse (Wikipedia, CC BY-SA) for hver struktur i modellen
const DESC_DIR = join(FBX_DIR, '..', '..', 'Descriptions', 'OriginalDescriptions');
const desc = {};
for (const n of root.listNodes()) {
  const name = n.getExtras().name;
  if (!name || desc[name] !== undefined) continue;
  const f = join(DESC_DIR, `${name}.txt`);
  if (!existsSync(f)) continue;
  const lead = readFileSync(f, 'utf8').split(/\n==/)[0].split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && p !== p.toUpperCase());
  if (lead.length) desc[name] = lead.slice(0, 2).join('\n\n');
}
writeFileSync(OUT_DESC, JSON.stringify(desc));
console.log(`${OUT_DESC}: ${Object.keys(desc).length} beskrivelser`);
