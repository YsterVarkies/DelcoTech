/*
 * DelcoTech logo in 3D (Three.js) for the circle in the About section:
 * the tilted sky tile, the navy D and the white dot. It spins in when it
 * scrolls into view, floats, and turns toward the mouse.
 * Without WebGL the original "D." lettering stays.
 */
import * as THREE from './assets/vendor/three/three.module.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const center = document.querySelector('.feature-center');
const symbol = center && center.querySelector('.feature-center-symbol');
const section = document.querySelector('.feature-section');

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

function roundedSquare(size, r) {
  const s = new THREE.Shape();
  const h = size / 2;
  s.moveTo(-h + r, -h);
  s.lineTo(h - r, -h); s.quadraticCurveTo(h, -h, h, -h + r);
  s.lineTo(h, h - r); s.quadraticCurveTo(h, h, h - r, h);
  s.lineTo(-h + r, h); s.quadraticCurveTo(-h, h, -h, h - r);
  s.lineTo(-h, -h + r); s.quadraticCurveTo(-h, -h, -h + r, -h);
  return s;
}

/* The "D" from the logo: a stem with a round bowl and a counter cut out. */
function letterD() {
  const k = 0.021;               /* drawn on a 100-unit grid, centred on (54, 50) */
  const p = (x, y) => [(x - 54) * k, (50 - y) * k];
  const s = new THREE.Shape();
  s.moveTo(...p(26, 19));
  s.lineTo(...p(49, 19));
  s.bezierCurveTo(...p(70, 19), ...p(82, 32), ...p(82, 50));
  s.bezierCurveTo(...p(82, 68), ...p(70, 81), ...p(49, 81));
  s.lineTo(...p(26, 81));
  s.lineTo(...p(26, 19));
  const hole = new THREE.Path();
  hole.moveTo(...p(42, 33));
  hole.lineTo(...p(42, 67));
  hole.lineTo(...p(48, 67));
  hole.bezierCurveTo(...p(59, 67), ...p(65, 60), ...p(65, 50));
  hole.bezierCurveTo(...p(65, 40), ...p(59, 33), ...p(48, 33));
  hole.lineTo(...p(42, 33));
  s.holes.push(hole);
  return s;
}

function buildLogo() {
  const logo = new THREE.Group();
  const tile = new THREE.Group();
  tile.rotation.z = 0.13;        /* the logo's tilt */

  const depth = 0.42;
  const slabGeo = new THREE.ExtrudeGeometry(roundedSquare(2.1, 0.5), { depth, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 6, curveSegments: 24 });
  slabGeo.translate(0, 0, -depth / 2);
  /* A clear, light sky blue: a touch of glow keeps it bright on the dark circle. */
  const face = new THREE.MeshStandardMaterial({ color: 0x8fd0fa, emissive: 0x6cbcf0, emissiveIntensity: 0.35, roughness: 0.3, metalness: 0 });
  const side = new THREE.MeshStandardMaterial({ color: 0x5ab4ec, emissive: 0x3590cf, emissiveIntensity: 0.2, roughness: 0.35, metalness: 0 });
  tile.add(new THREE.Mesh(slabGeo, [face, side]));

  const dGeo = new THREE.ExtrudeGeometry(letterD(), { depth: 0.14, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 3, curveSegments: 24 });
  const d = new THREE.Mesh(dGeo, new THREE.MeshStandardMaterial({ color: 0x0c1b24, roughness: 0.45 }));
  d.position.z = depth / 2 + 0.06;
  d.rotation.z = -0.13;          /* the D stands upright inside the tilted tile */
  tile.add(d);

  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 24), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 }));
  dot.position.set(1.08, 1.08, 0.2);
  tile.add(dot);

  logo.add(tile);
  return { logo, dot };
}

async function start() {
  if (!center || !symbol || !webglAvailable()) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'feature-3d';
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  symbol.appendChild(canvas);
  center.classList.add('is-3d');

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x16303f, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(2, 3, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7cc8f6, 1.6);
  rim.position.set(-3, -2, -2);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
  camera.position.set(0, 0, 8.4);

  const { logo, dot } = buildLogo();
  /* The circle is rotated -8deg in CSS; undo that so the logo keeps its own tilt. */
  logo.rotation.z = THREE.MathUtils.degToRad(8);
  const rig = new THREE.Group();
  rig.add(logo);
  scene.add(rig);

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(canvas);

  if (reduceMotion || !window.gsap) {
    renderer.render(scene, camera);
    return;
  }

  const { gsap } = window;
  const state = { spin: 0, turnX: 0, turnY: 0 };
  const pointer = { x: 0, y: 0 };
  let visible = false;

  /* Spin in the first time the circle comes into view. */
  state.spin = -Math.PI * 2;
  logo.scale.setScalar(0.4);
  let introduced = false;
  const intro = () => {
    if (introduced) return;
    introduced = true;
    gsap.to(state, { spin: 0, duration: 1.8, ease: 'expo.out' });
    gsap.to(logo.scale, { x: 1, y: 1, z: 1, duration: 1.4, ease: 'back.out(1.6)' });
  };

  if (finePointer && section) {
    section.addEventListener('pointermove', (e) => {
      const r = section.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width - 0.5;
      pointer.y = (e.clientY - r.top) / r.height - 0.5;
    });
    section.addEventListener('pointerleave', () => { pointer.x = 0; pointer.y = 0; });
  }

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible && entries[0].intersectionRatio > 0.4) intro();
  }, { threshold: [0, 0.45] }).observe(center);

  const clock = new THREE.Clock();
  const loop = () => {
    if (visible) {
      const t = clock.getElapsedTime();
      state.turnY += (pointer.x * 0.9 - state.turnY) * 0.06;
      state.turnX += (pointer.y * 0.6 - state.turnX) * 0.06;
      rig.rotation.y = state.spin + state.turnY + Math.sin(t * 0.9) * 0.18;
      rig.rotation.x = state.turnX + Math.sin(t * 0.7) * 0.06;
      rig.position.y = Math.sin(t * 1.3) * 0.1;
      dot.scale.setScalar(1 + Math.max(0, Math.sin(t * 2.4)) * 0.15);
      renderer.render(scene, camera);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

start();
