import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const LAYERS = ['skin', 'muscle', 'vessels', 'organs', 'skeleton'];

const MATERIALS = {
  skin: () => new THREE.MeshPhysicalMaterial({ color: 0xc8957a, roughness: 0.55, sheen: 0.4, sheenColor: 0xffd9c4, sheenRoughness: 0.6, transparent: true }),
  muscle: () => new THREE.MeshStandardMaterial({ color: 0x9e3b32, roughness: 0.6 }),
  vessels: () => new THREE.MeshStandardMaterial({ color: 0xa61e1e, roughness: 0.4 }),
  organs: () => new THREE.MeshStandardMaterial({ color: 0xb06a5a, roughness: 0.5 }),
  skeleton: () => new THREE.MeshStandardMaterial({ color: 0xe6dccb, roughness: 0.7 }),
};

export function createScene(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 50);
  camera.position.set(1.4, 1.35, 3.4);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0.95, 0);
  controls.enableDamping = true;
  controls.minDistance = 0.4;
  controls.maxDistance = 8;

  // Klinisk, neutral belysning: nøglelys + fyld + modlys
  scene.add(new THREE.HemisphereLight(0xf7f5f2, 0x2c2924, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2, 3, 3);
  const fill = new THREE.DirectionalLight(0xd6e4ed, 0.7);
  fill.position.set(-3, 1.5, 1);
  const rim = new THREE.DirectionalLight(0xffffff, 1.2);
  rim.position.set(0, 2.5, -3);
  scene.add(key, fill, rim);

  const grid = new THREE.GridHelper(6, 30, 0x4a4640, 0x2c2924);
  scene.add(grid);

  const layers = Object.fromEntries(LAYERS.map((l) => [l, []]));
  const body = new THREE.Group();
  scene.add(body);

  // Markør for valgt punkt
  const marker = new THREE.Mesh(
    new THREE.RingGeometry(0.012, 0.018, 32),
    new THREE.MeshBasicMaterial({ color: 0x6a90aa, side: THREE.DoubleSide, depthTest: false })
  );
  marker.renderOrder = 10;
  marker.visible = false;
  scene.add(marker);

  async function load(url) {
    const gltf = await new GLTFLoader().loadAsync(url);
    gltf.scene.traverse((o) => {
      if (!o.isMesh) return;
      const layer = o.userData.layer || o.parent?.userData.layer;
      if (!LAYERS.includes(layer)) return;
      o.material = MATERIALS[layer]();
      layers[layer].push(o);
    });
    body.add(gltf.scene);
  }

  function setLayerVisible(layer, on) {
    layers[layer].forEach((m) => (m.visible = on));
  }

  function setSkinOpacity(alpha) {
    layers.skin.forEach((m) => {
      m.material.opacity = alpha;
      m.material.depthWrite = alpha > 0.98;
    });
  }

  const raycaster = new THREE.Raycaster();
  function pick(ndc) {
    raycaster.setFromCamera(ndc, camera);
    const targets = LAYERS.flatMap((l) => layers[l]).filter((m) => m.visible);
    const hit = raycaster.intersectObjects(targets, false)[0];
    if (!hit) {
      marker.visible = false;
      return null;
    }
    const n = hit.face.normal.clone().transformDirection(hit.object.matrixWorld);
    marker.position.copy(hit.point).addScaledVector(n, 0.002);
    marker.lookAt(hit.point.clone().add(n));
    marker.visible = true;
    return hit;
  }

  const VIEWS = { front: [0, 1.1, 3.4], back: [0, 1.1, -3.4], side: [3.4, 1.1, 0], top: [0.01, 4.4, 0.4] };
  function view(name) {
    camera.position.set(...VIEWS[name]);
    controls.target.set(0, 0.95, 0);
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(container);
  resize();

  function setBackground(css) {
    scene.background = new THREE.Color(css);
  }

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
  });

  return { renderer, camera, layers, load, setLayerVisible, setSkinOpacity, pick, view, setBackground };
}
