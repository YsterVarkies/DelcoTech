/*
 * DelcoTech 3D tools: replaces each service card's icon with a small Three.js model.
 * Laptop (custom software), chip (custom AI), chat bubble (chatbots), browser
 * (websites), connected nodes (API) and shield (hosting & care).
 * If WebGL is unavailable the original SVG icons stay in place.
 */
import * as THREE from './assets/vendor/three/three.module.js';

const C = {
  sky: 0x7cc8f6,
  skyDeep: 0x4fb0ee,
  blue: 0x2f6f9f,
  ink: 0x0c1b24,
  white: 0xf7fbff,
  steel: 0xc9d6e0
};
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.38, metalness: 0.08, ...extra });

/* A rounded rectangle as a flat shape, used for screens, panels and the chat bubble. */
function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
const extrude = (shape, depth, bevel = 0.05) => {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 18 });
  g.center();
  return g;
};
const box = (w, h, d, color) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
const sphere = (r, color) => new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), mat(color));

/* ---------- The six models ---------- */
const builders = {
  software() {
    const g = new THREE.Group();
    const base = new THREE.Mesh(extrude(roundedRect(2.2, 1.45, 0.12), 0.08, 0.03), mat(C.ink));
    base.rotation.x = -Math.PI / 2;
    g.add(base);
    const hinge = new THREE.Group();
    hinge.position.set(0, 0.06, -0.7);
    g.userData.hinge = hinge;
    g.userData.lidOpen = -0.28;
    g.userData.lidClosed = Math.PI / 2 - 0.02;
    hinge.rotation.x = g.userData.lidOpen;
    const lid = new THREE.Mesh(extrude(roundedRect(2.2, 1.45, 0.12), 0.06, 0.03), mat(C.ink));
    lid.position.set(0, 0.72, 0);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.95, 1.2), mat(C.sky, { roughness: 0.25 }));
    screen.position.set(0, 0.72, 0.065);
    hinge.add(lid, screen);
    [[-0.45, 0.3, 0.7, C.ink], [-0.2, 0.15, 1.0, C.white], [-0.3, 0.0, 0.8, C.blue], [-0.1, -0.15, 1.2, C.white], [-0.4, -0.3, 0.6, C.ink]].forEach(([x, y, w, col]) => {
      const line = box(w, 0.08, 0.03, col);
      line.position.set(x + w / 2 - 0.35, 0.72 + y, 0.08);
      hinge.add(line);
    });
    g.add(hinge);
    g.position.y = -0.3;
    g.rotation.x = 0.35;
    g.scale.setScalar(0.8);
    return g;
  },

  ai() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(extrude(roundedRect(1.5, 1.5, 0.18), 0.22, 0.04), mat(C.ink));
    const core = new THREE.Mesh(extrude(roundedRect(0.85, 0.85, 0.12), 0.06, 0.02), mat(C.sky, { emissive: C.skyDeep, emissiveIntensity: 0.35 }));
    core.position.z = 0.16;
    g.add(body, core);
    for (let i = 0; i < 4; i++) {
      const offset = -0.45 + i * 0.3;
      [[offset, 0.95, 0.1, 0.3], [offset, -0.95, 0.1, 0.3], [0.95, offset, 0.3, 0.1], [-0.95, offset, 0.3, 0.1]].forEach(([x, y, w, h]) => {
        const pin = box(w, h, 0.1, C.steel);
        pin.position.set(x, y, 0);
        g.add(pin);
      });
    }
    g.userData.pulse = core;
    g.rotation.x = -0.25;
    return g;
  },

  chat() {
    const g = new THREE.Group();
    const anchor = new THREE.Group();          /* bottom-left corner, where the tail points */
    anchor.position.set(-0.85, -0.95, 0);
    const body = new THREE.Group();
    body.position.set(0.85, 0.95, 0);
    anchor.add(body);
    g.add(anchor);
    const s = roundedRect(2.0, 1.35, 0.42);
    const tail = new THREE.Shape();
    tail.moveTo(-0.55, -0.6); tail.lineTo(-0.85, -1.05); tail.lineTo(-0.15, -0.62);
    const bubble = new THREE.Mesh(extrude(s, 0.3), mat(C.sky));
    const tailMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(tail, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 }), mat(C.sky));
    tailMesh.position.z = -0.15;
    body.add(bubble, tailMesh);
    const dots = [-0.5, 0, 0.5].map((x) => {
      const d = sphere(0.13, C.ink);
      d.position.set(x, 0.05, 0.22);
      body.add(d);
      return d;
    });
    g.userData.dots = dots;
    g.userData.pop = anchor;
    g.position.y = 0.12;
    return g;
  },

  website() {
    const g = new THREE.Group();
    const panel = new THREE.Mesh(extrude(roundedRect(2.2, 1.6, 0.14), 0.1, 0.03), mat(C.white));
    const bar = box(2.1, 0.26, 0.04, C.sky);
    bar.position.set(0, 0.6, 0.09);
    g.add(panel, bar);
    const inner = [bar];
    [0xe7998e, 0xe5cb87, 0x9bce9a].forEach((col, i) => {
      const d = sphere(0.055, col);
      d.position.set(-0.9 + i * 0.16, 0.6, 0.13);
      g.add(d);
      inner.push(d);
    });
    const hero = box(0.95, 0.5, 0.05, C.blue);
    hero.position.set(-0.45, 0.12, 0.09);
    const art = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 32), mat(C.skyDeep));
    art.rotation.x = Math.PI / 2;
    art.position.set(0.55, 0.12, 0.1);
    const l1 = box(1.6, 0.08, 0.04, C.steel); l1.position.set(-0.1, -0.35, 0.09);
    const l2 = box(1.1, 0.08, 0.04, C.steel); l2.position.set(-0.35, -0.52, 0.09);
    g.add(hero, art, l1, l2);
    inner.push(hero, art, l1, l2);
    g.userData.pieces = inner.map((m) => ({ m, z: m.position.z }));
    return g;
  },

  api() {
    const g = new THREE.Group();
    const nodes = [[-1.0, 0, C.sky], [1.0, 0.75, C.skyDeep], [1.0, -0.75, C.blue]].map(([x, y, col]) => {
      const n = sphere(0.32, col);
      n.position.set(x, y, 0);
      g.add(n);
      return n;
    });
    const hub = sphere(0.18, C.ink);
    hub.position.set(0.05, 0, 0);
    g.add(hub);
    const link = (a, b) => {
      const dir = new THREE.Vector3().subVectors(b, a);
      const len = dir.length();
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, len, 12), mat(C.ink));
      tube.position.copy(a).addScaledVector(dir, 0.5);
      tube.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
      g.add(tube);
    };
    nodes.forEach((n) => link(hub.position, n.position));
    g.userData.nodes = nodes;
    return g;
  },

  shield() {
    const g = new THREE.Group();
    const s = new THREE.Shape();
    s.moveTo(0, 1.05);
    s.quadraticCurveTo(0.45, 0.85, 0.85, 0.82);
    s.lineTo(0.85, 0.05);
    s.quadraticCurveTo(0.82, -0.7, 0, -1.1);
    s.quadraticCurveTo(-0.82, -0.7, -0.85, 0.05);
    s.lineTo(-0.85, 0.82);
    s.quadraticCurveTo(-0.45, 0.85, 0, 1.05);
    const shield = new THREE.Mesh(extrude(s, 0.3, 0.06), mat(C.sky));
    const path = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.38, 0.0, 0), new THREE.Vector3(-0.1, -0.28, 0), new THREE.Vector3(0.42, 0.3, 0)], false, 'catmullrom', 0.1);
    const check = new THREE.Mesh(new THREE.TubeGeometry(path, 32, 0.09, 12, false), mat(C.ink));
    check.position.z = 0.24;
    const capA = sphere(0.09, C.ink); capA.position.set(-0.38, 0.0, 0.24);
    const capB = sphere(0.09, C.ink); capB.position.set(0.42, 0.3, 0.24);
    g.add(shield, check, capA, capB);
    return g;
  }
};

/* ---------- One small renderer per card icon ---------- */
function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

const views = [];

function createView(icon, kind) {
  const build = builders[kind];
  if (!build) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'tool-3d';
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9fb7c8, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2.5, 3, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7cc8f6, 1.2);
  rim.position.set(-3, -1, -2);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 6.2);

  const pivot = new THREE.Group();
  const model = build();
  pivot.add(model);
  scene.add(pivot);

  icon.appendChild(canvas);
  icon.classList.add('has-3d');

  const view = {
    icon, kind, renderer, scene, camera, pivot, model, canvas,
    visible: true, hover: 0,
    target: { x: 0, y: 0 }, current: { x: 0, y: 0 },
    seed: Math.random() * 10
  };

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(icon);

  /* The model turns toward the mouse; some also have their own hover move. */
  const card = icon.closest('.service-card');
  const u = model.userData;
  if (card && !reduceMotion) {
    card.addEventListener('pointerenter', () => {
      view.hover = 1;
      const gsap = window.gsap;
      if (!gsap) return;
      if (u.hinge) {
        gsap.fromTo(u.hinge.rotation, { x: u.lidClosed }, { x: u.lidOpen, duration: 1.6, ease: 'back.out(2)', overwrite: true });
      }
      if (u.pop) {
        /* A new-message popup: grows from tiny at the tail corner up to full size. */
        gsap.fromTo(u.pop.scale, { x: 0.05, y: 0.05, z: 0.05 }, { x: 1, y: 1, z: 1, duration: 0.8, ease: 'back.out(1.9)', overwrite: true });
        gsap.fromTo(u.pop.rotation, { z: -0.35 }, { z: 0, duration: 0.8, ease: 'back.out(1.6)', overwrite: true });
      }
      if (u.pieces) {
        /* The pieces inside the browser pop out toward you, then settle back. */
        const pieces = u.pieces;
        gsap.killTweensOf(pieces.map((p) => p.m.position));
        gsap.killTweensOf(pieces.map((p) => p.m.scale));
        const tl = gsap.timeline();
        /* Kept modest: pushed further forward and scaled up much more, the big
           "art" circle swells to fill the card in a blue close to the hover
           background, so the icon briefly reads as a blank blue blob. */
        tl.to(pieces.map((p) => p.m.position), { z: (i) => pieces[i].z + 0.55, duration: 0.3, stagger: 0.06, ease: 'power2.out' }, 0)
          .to(pieces.map((p) => p.m.scale), { x: 1.18, y: 1.18, z: 1.18, duration: 0.3, stagger: 0.06, ease: 'power2.out' }, 0)
          .to(pieces.map((p) => p.m.position), { z: (i) => pieces[i].z, duration: 0.55, stagger: 0.05, ease: 'back.out(2.2)' }, 0.4)
          .to(pieces.map((p) => p.m.scale), { x: 1, y: 1, z: 1, duration: 0.55, stagger: 0.05, ease: 'back.out(2.2)' }, 0.4);
      }
    });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      view.target.y = ((e.clientX - r.left) / r.width - 0.5) * 1.1;
      view.target.x = ((e.clientY - r.top) / r.height - 0.5) * 0.7;
    });
    card.addEventListener('pointerleave', () => {
      view.hover = 0; view.target.x = 0; view.target.y = 0;
    });
  }
  views.push(view);
  return view;
}

function animate(time) {
  const t = time / 1000;
  views.forEach((v) => {
    if (!v.visible) return;
    v.current.x += (v.target.x - v.current.x) * 0.08;
    v.current.y += (v.target.y - v.current.y) * 0.08;
    const idle = reduceMotion ? 0 : Math.sin(t * 0.8 + v.seed) * 0.35;
    v.pivot.rotation.y = idle + v.current.y;
    v.pivot.rotation.x = v.current.x;
    v.pivot.position.y = reduceMotion ? 0 : Math.sin(t * 1.4 + v.seed) * 0.08;
    const s = 1 + v.hover * 0.06;
    v.pivot.scale.lerp(new THREE.Vector3(s, s, s), 0.1);

    /* Small touches per model */
    const u = v.model.userData;
    if (u.dots) u.dots.forEach((d, i) => { d.position.y = 0.05 + (reduceMotion ? 0 : Math.max(0, Math.sin(t * 5 - i * 0.7)) * 0.14); });
    if (u.pulse) u.pulse.material.emissiveIntensity = 0.3 + (reduceMotion ? 0 : (Math.sin(t * 2.4) + 1) * 0.25);
    if (u.nodes) u.nodes.forEach((n, i) => { n.scale.setScalar(1 + (reduceMotion ? 0 : Math.sin(t * 2.2 + i * 2.1) * 0.08)); });

    v.renderer.render(v.scene, v.camera);
  });
  if (!reduceMotion) requestAnimationFrame(animate);
}

function start() {
  if (!webglAvailable()) return;
  const icons = [...document.querySelectorAll('.service-icon[data-kind]')];
  icons.forEach((icon) => createView(icon, icon.dataset.kind));
  if (!views.length) return;

  /* Only draw the models that are on screen. */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const v = views.find((view) => view.icon === entry.target);
      if (v) v.visible = entry.isIntersecting;
    });
  }, { rootMargin: '100px' });
  views.forEach((v) => io.observe(v.icon));

  requestAnimationFrame(animate);
}

start();
