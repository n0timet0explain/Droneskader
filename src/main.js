import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { buildBody, regionFor } from './body.js';
import { buildGear, GEAR, PRESETS } from './gear.js';
import { REGIONS, MARCH, KIT } from './regions.js';
import './style.css';

// ---------- Scene ----------
const viewport = document.getElementById('viewport');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
viewport.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1b1f1c);
const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 100);
camera.position.set(1.6, 1.5, 3.2);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.enableDamping = true;
controls.minDistance = 0.6;
controls.maxDistance = 10;

scene.add(new THREE.HemisphereLight(0xdfe8e0, 0x2a2a22, 1.4));
const sun = new THREE.DirectionalLight(0xffffff, 1.6);
sun.position.set(2, 4, 3);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);
const ground = new THREE.Mesh(new THREE.CircleGeometry(6, 48), new THREE.MeshStandardMaterial({ color: 0x3a3f33, roughness: 1 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
scene.add(new THREE.GridHelper(12, 24, 0x555c4a, 0x444a3c));

const body = buildBody();
scene.add(body.group);
const gear = buildGear();
for (const g of Object.values(gear.groups)) scene.add(g);

const fx = new THREE.Group(); // fragmentlinjer og detonationspunkt
const marks = new THREE.Group(); // sår og stoppede fragmenter
scene.add(fx, marks);

function resize() {
  const { clientWidth: w, clientHeight: h } = viewport;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(viewport);

// ---------- Udrustning ----------
const gearList = document.getElementById('gear-list');
const active = new Set();
for (const [key, g] of Object.entries(GEAR)) {
  const label = document.createElement('label');
  label.className = 'check';
  label.innerHTML = `<input type="checkbox" data-gear="${key}"><span>${g.name}</span><small>${Math.round(g.protection * 100)}%</small>`;
  gearList.appendChild(label);
}
gearList.addEventListener('change', (e) => setGear(e.target.dataset.gear, e.target.checked));

function setGear(key, on) {
  on ? active.add(key) : active.delete(key);
  gear.groups[key].visible = on;
  gearList.querySelector(`[data-gear="${key}"]`).checked = on;
}

const presetBox = document.getElementById('presets');
for (const [key, p] of Object.entries(PRESETS)) {
  const b = document.createElement('button');
  b.textContent = p.name;
  b.onclick = () => {
    for (const k of Object.keys(GEAR)) setGear(k, p.items.includes(k));
    presetBox.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
  };
  presetBox.appendChild(b);
}

document.getElementById('gear-opacity').addEventListener('input', (e) => {
  for (const m of gear.meshes) {
    m.material.opacity = +e.target.value;
    m.material.depthWrite = +e.target.value > 0.95;
  }
});

// ---------- Simulering ----------
const DIRECTIONS = {
  front: { name: 'Forfra', pos: (d) => new THREE.Vector3(0.05, 1.3, d) },
  above: { name: 'Ovenfra', pos: (d) => new THREE.Vector3(0.15, 1.8 + d, 0.25) },
  back: { name: 'Bagfra', pos: (d) => new THREE.Vector3(-0.05, 1.3, -d) },
  side: { name: 'Fra siden', pos: (d) => new THREE.Vector3(d, 1.2, 0.1) },
  ground: { name: 'Jordniveau foran', pos: (d) => new THREE.Vector3(0.25, 0.1, d) },
};
const dirSelect = document.getElementById('direction');
for (const [k, d] of Object.entries(DIRECTIONS)) dirSelect.add(new Option(d.name, k));
const distInput = document.getElementById('distance');
const distOut = document.getElementById('distance-out');
distInput.addEventListener('input', () => (distOut.textContent = `${(+distInput.value).toFixed(1)} m`));

const woundMat = new THREE.MeshBasicMaterial({ color: 0xd8262b });
const stopMat = new THREE.MeshBasicMaterial({ color: 0xb8b8a8 });
const markGeo = new THREE.SphereGeometry(0.012, 10, 8);
const raycaster = new THREE.Raycaster();
let lastResult = null;
let fade = null;

function clearSim() {
  fx.clear();
  marks.clear();
  lastResult = null;
  showIntro();
}

function simulate() {
  clearSim();
  const d = +distInput.value;
  const origin = DIRECTIONS[dirSelect.value].pos(d);
  const targets = [...body.parts, ...gear.meshes.filter((m) => active.has(m.userData.gear))];

  // Flere fragmenter rammer personen jo tættere detonationen er (∝ 1/d²). Rent illustrativt.
  const n = Math.round(THREE.MathUtils.clamp(140 / (d * d) + 10, 15, 260));
  const linePts = [];
  const wounds = {};
  let stopped = 0;

  for (let i = 0; i < n; i++) {
    const t = new THREE.Vector3((Math.random() - 0.5) * 0.9, Math.random() * 1.85, (Math.random() - 0.5) * 0.35);
    const dir = t.sub(origin).normalize();
    raycaster.set(origin, dir);
    const hits = raycaster.intersectObjects(targets, false);
    let end = origin.clone().addScaledVector(dir, d + 1.5);
    for (const h of hits) {
      const gk = h.object.userData.gear;
      if (gk) {
        if (Math.random() < GEAR[gk].protection) {
          addMark(h.point, stopMat);
          stopped++;
          end = h.point;
          break;
        }
        continue; // fragmentet går igennem udrustningen
      }
      const region = regionFor(h.object.userData.part, h.point);
      if (region) {
        wounds[region] = (wounds[region] || 0) + 1;
        addMark(h.point, woundMat);
      }
      end = h.point;
      break;
    }
    linePts.push(origin, end);
  }

  const lines = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(linePts),
    new THREE.LineBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.8 })
  );
  const flash = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true }));
  flash.position.copy(origin);
  fx.add(lines, flash);
  fade = { t0: performance.now(), lines, flash };

  lastResult = { wounds, stopped, total: n, distance: d, dirName: DIRECTIONS[dirSelect.value].name };
  showResult();
}

function addMark(p, mat) {
  const m = new THREE.Mesh(markGeo, mat);
  m.position.copy(p);
  marks.add(m);
}

document.getElementById('simulate').onclick = simulate;
document.getElementById('reset').onclick = clearSim;

// ---------- Info-panel ----------
const info = document.getElementById('info');

function showIntro() {
  info.innerHTML = `
    <h2>Sådan bruger du modellen</h2>
    <ul class="plain">
      <li><b>Drej</b> figuren med venstre mus, <b>zoom</b> med hjulet, <b>panorér</b> med højre mus.</li>
      <li><b>Vælg udrustning</b> til venstre, og se hvad den dækker – og hvad den ikke dækker.</li>
      <li><b>Simulér</b> en detonation, og se hvor fragmenterne rammer.</li>
      <li><b>Klik på kroppen</b> for at se hvad der sker i den region, og hvilken førstehjælp der skal til.</li>
    </ul>
    <p class="muted">Rød prik = sår. Grå prik = fragment stoppet af udrustning.</p>`;
}

function showResult() {
  const r = lastResult;
  const entries = Object.entries(r.wounds).sort(
    ([a, na], [b, nb]) => MARCH[REGIONS[a].march].order - MARCH[REGIONS[b].march].order || nb - na
  );
  const hitsTotal = entries.reduce((s, [, c]) => s + c, 0);
  const blast =
    r.distance < 2
      ? `<div class="alert"><b>Tæt detonation (${r.distance.toFixed(1)} m):</b> mistænk skjulte <b>trykbølgeskader</b> på lunger, trommehinder og tarm. Vesten beskytter ikke mod trykbølgen. Overvåg vejrtrækning, også selvom der ikke er synlige sår.</div>`
      : '';
  info.innerHTML = `
    <h2>Resultat – ${r.dirName}, ${r.distance.toFixed(1)} m</h2>
    <div class="stats">
      <div><b>${hitsTotal}</b><span>sår</span></div>
      <div><b>${r.stopped}</b><span>stoppet af udrustning</span></div>
      <div><b>${entries.length}</b><span>regioner ramt</span></div>
    </div>
    ${blast}
    <h3>Behandlingsrækkefølge (MARCH)</h3>
    ${
      entries.length
        ? `<ol class="march">${entries
            .map(
              ([k, c]) =>
                `<li><button data-region="${k}"><span class="tag tag-${REGIONS[k].march}">${REGIONS[k].march}</span>${REGIONS[k].name}<small>${c} sår · ${REGIONS[k].type}</small></button></li>`
            )
            .join('')}</ol>`
        : '<p>Ingen fragmenter ramte kroppen.</p>'
    }
    <p class="muted">Klik på en region for detaljer.</p>`;
}

function showRegion(key) {
  const r = REGIONS[key];
  const n = lastResult?.wounds[key];
  info.innerHTML = `
    ${lastResult ? '<button class="back" id="back">← Tilbage til resultat</button>' : ''}
    <h2><span class="tag tag-${r.march}">${r.march}</span>${r.name}</h2>
    <p class="meta">${r.type} · ${MARCH[r.march].label} · <b>${r.urgency}</b>${n ? ` · ${n} sår` : ''}</p>
    <h3>Hvad sker der i kroppen</h3>
    <p>${r.what}</p>
    <h3>Tegn</h3>
    <ul>${r.signs.map((s) => `<li>${s}</li>`).join('')}</ul>
    <h3>Førstehjælp</h3>
    <ol>${r.aid.map((s) => `<li>${s}</li>`).join('')}</ol>
    <h3>Udstyr</h3>
    <div class="kit">${r.gear.map((g) => `<div><b>${KIT[g].name}</b><span>${KIT[g].use}</span></div>`).join('')}</div>`;
  document.getElementById('back')?.addEventListener('click', showResult);
}

info.addEventListener('click', (e) => {
  const b = e.target.closest('[data-region]');
  if (b) showRegion(b.dataset.region);
});

// Klik på kroppen → regionsinfo
const pointer = new THREE.Vector2();
let downAt = null;
renderer.domElement.addEventListener('pointerdown', (e) => (downAt = [e.clientX, e.clientY]));
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 5) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(body.parts, false)[0];
  if (hit) showRegion(regionFor(hit.object.userData.part, hit.point));
});

// Kameravinkler
const VIEWS = { front: [0, 1.2, 3.2], back: [0, 1.2, -3.2], side: [3.2, 1.2, 0], top: [0.01, 4.2, 0.6] };
document.getElementById('views').addEventListener('click', (e) => {
  const v = VIEWS[e.target.dataset.view];
  if (!v) return;
  camera.position.set(...v);
  controls.target.set(0, 1, 0);
});

// ---------- Loop ----------
function tick(now) {
  controls.update();
  if (fade) {
    const k = Math.min((now - fade.t0) / 2500, 1);
    fade.lines.material.opacity = 0.8 * (1 - k);
    fade.flash.material.opacity = 1 - k;
    fade.flash.scale.setScalar(1 + k * 4);
    if (k === 1) {
      fx.clear();
      fade = null;
    }
  }
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

document.querySelector('#presets button:nth-child(3)').click();
showIntro();
resize();
requestAnimationFrame(tick);
