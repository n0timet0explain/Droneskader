import '@fontsource/barlow/300.css';
import '@fontsource/barlow/400.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow/700.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles.css';
import * as THREE from 'three';
import logoSvg from './assets/logo.svg?raw';
import anatomyUrl from './assets/anatomy.glb?url';
import DESCRIPTIONS from './data/descriptions.json';
import { createScene, LAYERS } from './scene.js';
import { t, tr, setLang, getLang, onLang, applyStatic, dtg } from './i18n.js';
import { REGIONS, TYPES, regionForSkin } from './data/regions.js';
import { MUNITIONS } from './data/munitions.js';

const LAYER_NAMES = {
  skin: { da: 'Hud', en: 'Skin' },
  muscle: { da: 'Muskler', en: 'Muscles' },
  vessels: { da: 'Kar · arterier og vener', en: 'Vessels · arteries and veins' },
  nerves: { da: 'Nervesystem', en: 'Nervous system' },
  organs: { da: 'Organer', en: 'Organs' },
  skeleton: { da: 'Skelet', en: 'Skeleton' },
};

document.getElementById('logo').innerHTML = logoSvg.replace(/<\?xml[^>]*>/, '');

const viewport = document.getElementById('viewport');
const app = createScene(viewport);
const info = document.getElementById('info');
const coords = document.getElementById('coords');
let selection = null; // { kind: 'region' | 'munition', ... }

// ── Lag ────────────────────────────────────────────────────
const layerList = document.getElementById('layer-list');
const layerOn = Object.fromEntries(LAYERS.map((l) => [l, true]));

function renderLayers() {
  layerList.innerHTML = LAYERS.map((l) => {
    const ready = app.layers[l].length > 0;
    return `<label class="layer ${ready ? '' : 'off'}">
      <input type="checkbox" data-layer="${l}" ${ready && layerOn[l] ? 'checked' : ''} ${ready ? '' : 'disabled'}>
      <span>${tr(LAYER_NAMES[l])}</span>
      <small class="meta">${ready ? t('layerReady') : t('layerMissing')}</small>
    </label>`;
  }).join('');
}
layerList.addEventListener('change', (e) => {
  const l = e.target.dataset.layer;
  layerOn[l] = e.target.checked;
  app.setLayerVisible(l, layerOn[l]);
});
document.getElementById('skin-opacity').addEventListener('input', (e) => app.setSkinOpacity(+e.target.value));

// ── Ladninger ──────────────────────────────────────────────
const munitionList = document.getElementById('munition-list');
function renderMunitions() {
  munitionList.innerHTML = MUNITIONS.map(
    (m) => `<button class="card" data-munition="${m.id}">
      <div class="row"><b>${m.name}</b>${m.uncertain ? `<span class="badge warn">${t('uncertain')}</span>` : ''}</div>
      <div class="meta">${m.weight} · ${tr(m.delivery)}</div>
    </button>`
  ).join('');
}
munitionList.addEventListener('click', (e) => {
  const b = e.target.closest('[data-munition]');
  if (b) show({ kind: 'munition', id: b.dataset.munition });
});

// ── Info-panel ─────────────────────────────────────────────
const statusBadge = (s = 'draft') => `<span class="badge ${s}">${t(s)}</span>`;

function show(sel) {
  selection = sel;
  if (!sel) {
    info.innerHTML = `
      <span class="label">FIG. 01 · ${t('introTitle')}</span>
      <h2>${t('introTitle')}</h2>
      <p>${t('intro')}</p>
      <p class="callout muted">${t('introNote')}</p>
      <p class="meta" style="margin-top:24px">${t('credits')}</p>`;
    return;
  }
  if (sel.kind === 'region') {
    const r = REGIONS[sel.id];
    const side = sel.side ? ` (${t(sel.side)})` : '';
    info.innerHTML = `
      <button class="back" id="back">${t('back_')}</button>
      <span class="label">${t('region')} · ${tr(TYPES[r.type])}</span>
      <h2>${tr(r.name)}${side}</h2>
      <div class="meta">${sel.anatomical}</div>
      <div class="row" style="margin-top:8px">${statusBadge('draft')}</div>
      <h3>${t('structures')}</h3>
      <ul class="structs">${r.structures.map((s) => `<li>${tr(s)}</li>`).join('')}</ul>
      <h3>${t('significance')}</h3>
      <p class="callout">${tr(r.significance)}</p>`;
  } else if (sel.kind === 'structure') {
    const d = DESCRIPTIONS[sel.name];
    const side = sel.side ? ` (${t(sel.side)})` : '';
    info.innerHTML = `
      <button class="back" id="back">${t('back_')}</button>
      <span class="label">${t('structure')} · ${tr(LAYER_NAMES[sel.layer])}</span>
      <h2>${sel.name}${side}</h2>
      ${d ? `<h3>${t('description')}</h3>${d.split('\n\n').map((p) => `<p>${p}</p>`).join('')}<p class="meta">${t('descSource')}</p>` : `<p class="muted">${t('noDescription')}</p>`}`;
  } else {
    const m = MUNITIONS.find((x) => x.id === sel.id);
    info.innerHTML = `
      <button class="back" id="back">${t('back_')}</button>
      <span class="label">HE-FRAG · ${tr(m.delivery)}</span>
      <h2>${m.name}</h2>
      <div class="row">${m.uncertain ? `<span class="badge warn">${t('uncertain')}</span>` : ''}${statusBadge('draft')}</div>
      <h3>&nbsp;</h3>
      <table>
        <tr><td>${t('class')}</td><td>HE-FRAG</td></tr>
        <tr><td>${t('weight')}</td><td>${m.weight}</td></tr>
        <tr><td>${t('delivery')}</td><td>${tr(m.delivery)}</td></tr>
        <tr><td>${t('fragments')}</td><td>${tr(m.fragments)}</td></tr>
        <tr><td>${t('source')}</td><td>${tr(m.source)}</td></tr>
      </table>
      <p class="callout" style="margin-top:16px">${tr(m.note)}</p>`;
  }
  document.getElementById('back').onclick = () => show(null);
}

// ── Klik på kroppen ────────────────────────────────────────
let down = null;
const canvas = app.renderer.domElement;
canvas.addEventListener('pointerdown', (e) => (down = [e.clientX, e.clientY]));
canvas.addEventListener('pointerup', (e) => {
  if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
  const r = canvas.getBoundingClientRect();
  const hit = app.pick(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1));
  if (!hit) return;
  const p = hit.point;
  const u = hit.object.userData;
  const side = u.side === 'l' ? 'left' : u.side === 'r' ? 'right' : null;
  coords.textContent = `${u.name} · X ${p.x.toFixed(3)} · Y ${p.y.toFixed(3)} · Z ${p.z.toFixed(3)} M`;
  const region = u.layer === 'skin' && regionForSkin(u.name, p);
  if (region) show({ kind: 'region', id: region, side, anatomical: u.name });
  else show({ kind: 'structure', name: u.name, layer: u.layer, side });
});

document.getElementById('views').addEventListener('click', (e) => e.target.dataset.view && app.view(e.target.dataset.view));

// ── Sprog og tema ──────────────────────────────────────────
const langBox = document.getElementById('lang');
langBox.addEventListener('click', (e) => e.target.dataset.lang && setLang(e.target.dataset.lang));

function renderChrome() {
  langBox.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.lang === getLang()));
  document.getElementById('stamp').textContent = `STØD MEDICAL // HE-FRAG // ${dtg()}`;
  renderLayers();
  renderMunitions();
  show(selection);
}
onLang(renderChrome);

const syncBg = () => app.setBackground(getComputedStyle(document.documentElement).getPropertyValue('--scene-bg').trim());
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncBg);
syncBg();

document.documentElement.lang = getLang();
applyStatic();
renderChrome();

coords.textContent = t('loading');
app.load(anatomyUrl).then(() => {
  coords.textContent = '';
  renderLayers();
});
