/*
 * DelcoTech hero: a 3D laptop (Three.js) that opens on load and boots into the
 * mock website, turns toward the mouse, and folds a little as you scroll away.
 * The screen is drawn on a 2D canvas and used as a texture.
 * Without WebGL the original HTML browser mock stays in place.
 */
import * as THREE from './assets/vendor/three/three.module.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const heroArt = document.querySelector('.hero-art');
const hero = document.querySelector('.hero');

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

/* ---------- The screen: the mock website drawn on a canvas ---------- */
const SW = 1280, SH = 800;
const screenCanvas = document.createElement('canvas');
screenCanvas.width = SW;
screenCanvas.height = SH;
const ctx = screenCanvas.getContext('2d');
const HEAD = '"Plus Jakarta Sans", system-ui, sans-serif';
const BODY = '"DM Sans", system-ui, sans-serif';

/* What the screen shows right now; GSAP animates these numbers. */
const screenState = { boot: 0, typed: 0, button: 0, art: 0, spin: 0 };
const HEADLINE_1 = 'A better';
const HEADLINE_2 = 'first ';
const HEADLINE_ITALIC = 'impression.';

function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawScreen() {
  const s = screenState;
  ctx.save();
  ctx.fillStyle = '#0c1b24';
  ctx.fillRect(0, 0, SW, SH);
  ctx.globalAlpha = s.boot;

  /* page */
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, SW, SH);

  /* browser chrome */
  ctx.fillStyle = '#eef2f6';
  ctx.fillRect(0, 0, SW, 70);
  ctx.fillStyle = '#d8dde3';
  ctx.fillRect(0, 69, SW, 2);
  [['#e7998e', 40], ['#e5cb87', 66], ['#9bce9a', 92]].forEach(([c, x]) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, 35, 9, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = '#ffffff';
  rr(SW / 2 - 230, 17, 460, 36, 9); ctx.fill();
  ctx.fillStyle = '#7e8882';
  ctx.font = `500 18px ${BODY}`;
  ctx.textAlign = 'center';
  ctx.fillText('yourbusiness.co.za', SW / 2, 41);
  ctx.textAlign = 'left';

  /* site header */
  ctx.fillStyle = '#152129';
  ctx.font = `800 46px ${HEAD}`;
  ctx.fillText('a', 64, 150);
  ctx.fillStyle = '#5fb0e6';
  ctx.fillText('.', 64 + ctx.measureText('a').width + 2, 150);
  ctx.fillStyle = '#152129';
  ctx.font = `800 15px ${HEAD}`;
  ctx.textAlign = 'right';
  ctx.fillText('HOME     ABOUT     CONTACT', SW - 64, 140);
  ctx.textAlign = 'left';

  /* copy */
  ctx.fillStyle = '#6a9cc0';
  ctx.font = `800 15px ${HEAD}`;
  ctx.fillText("MADE FOR WHAT'S NEXT", 64, 268);

  const total = HEADLINE_1.length + HEADLINE_2.length + HEADLINE_ITALIC.length;
  let n = Math.round(s.typed * total);
  const l1 = HEADLINE_1.slice(0, Math.min(n, HEADLINE_1.length)); n -= l1.length;
  const l2 = HEADLINE_2.slice(0, Math.max(0, Math.min(n, HEADLINE_2.length))); n -= l2.length;
  const l3 = HEADLINE_ITALIC.slice(0, Math.max(0, n));
  ctx.fillStyle = '#152129';
  ctx.font = `800 74px ${HEAD}`;
  ctx.fillText(l1, 60, 352);
  ctx.fillText(l2, 60, 432);
  const l2w = ctx.measureText(HEADLINE_2).width;
  ctx.fillStyle = '#3f95d0';
  ctx.font = `italic 400 74px Georgia, serif`;
  ctx.fillText(l3, 60 + l2w - 6, 432);
  if (s.typed < 1 && s.boot > 0.5 && Math.floor(performance.now() / 420) % 2 === 0) {
    const onLine2 = l2.length > 0 || l3.length > 0;
    let x;
    if (l3.length) { ctx.font = 'italic 400 74px Georgia, serif'; x = 60 + l2w - 6 + ctx.measureText(l3).width; }
    else { ctx.font = `800 74px ${HEAD}`; x = 60 + ctx.measureText(onLine2 ? l2 : l1).width; }
    ctx.fillStyle = '#3f95d0';
    ctx.fillRect(x + 4, onLine2 ? 376 : 296, 5, 66);
  }

  ctx.globalAlpha = s.boot * Math.min(1, s.typed * 1.4);
  ctx.fillStyle = '#68777b';
  ctx.font = `400 22px ${BODY}`;
  ['A website that helps your business', 'stand out and makes getting in', 'touch effortless.'].forEach((line, i) => ctx.fillText(line, 64, 500 + i * 34));

  /* button */
  ctx.globalAlpha = s.boot * s.button;
  ctx.save();
  ctx.translate(64, 610 + (1 - s.button) * 14);
  ctx.fillStyle = '#123247';
  rr(0, 0, 220, 60, 8); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 19px ${BODY}`;
  ctx.fillText("Let's connect  ↗", 26, 37);
  ctx.restore();

  /* art */
  ctx.globalAlpha = s.boot * s.art;
  const cx = 930, cy = 430;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(0.12);
  ctx.fillStyle = '#d3e8f8';
  rr(-200, -230, 400, 470, 40); ctx.fill();
  ctx.restore();
  const disc = ctx.createLinearGradient(cx - 150, cy - 120, cx + 70, cy + 120);
  disc.addColorStop(0.15, '#8ec6ee'); disc.addColorStop(1, '#2f6a99');
  ctx.fillStyle = disc;
  ctx.beginPath(); ctx.arc(cx - 40, cy + 20, 135, 0, Math.PI * 2); ctx.fill();
  ctx.save();
  ctx.translate(cx + 10, cy - 10);
  ctx.rotate(0.62 + s.spin);
  const pill = ctx.createLinearGradient(-60, -180, 60, 180);
  pill.addColorStop(0, '#f2faff'); pill.addColorStop(0.62, '#8fbde0'); pill.addColorStop(1, '#2f5f86');
  ctx.fillStyle = pill;
  rr(-72, -185, 144, 370, 70); ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.translate(cx - 30, cy + 30);
  ctx.rotate(0.78 - s.spin * 0.6);
  ctx.strokeStyle = '#e6f4ff';
  ctx.lineWidth = 34;
  ctx.beginPath(); ctx.ellipse(0, 0, 140, 102, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
  ctx.fillStyle = '#2f5f86';
  ctx.beginPath(); ctx.arc(cx + 165, cy - 200 + Math.sin(performance.now() / 600) * 8, 16, 0, Math.PI * 2); ctx.fill();

  /* footer line */
  ctx.globalAlpha = s.boot;
  ctx.fillStyle = '#e1e0d7';
  ctx.fillRect(64, 730, SW - 128, 2);
  ctx.fillStyle = '#89948c';
  ctx.font = `800 14px ${HEAD}`;
  ctx.fillText('DESIGNED FOR YOU', 64, 765);
  ctx.textAlign = 'right';
  ctx.fillText('01 / 03', SW - 64, 765);
  ctx.textAlign = 'left';
  ctx.restore();
}

/* ---------- The laptop ---------- */
function roundedShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function slab(w, h, r, depth, material) {
  const g = new THREE.ExtrudeGeometry(roundedShape(w, h, r), { depth, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 12 });
  g.translate(0, 0, -depth / 2);
  return new THREE.Mesh(g, material);
}
function keyboardTexture() {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 380;
  const k = c.getContext('2d');
  k.fillStyle = '#16303f';
  k.fillRect(0, 0, c.width, c.height);
  const rows = [14, 14, 13, 12];
  rows.forEach((count, r) => {
    const keyW = (c.width - 40 - (count - 1) * 8) / count;
    for (let i = 0; i < count; i++) {
      k.fillStyle = '#0c1b24';
      k.beginPath();
      const x = 20 + i * (keyW + 8), y = 20 + r * 72;
      k.roundRect ? k.roundRect(x, y, keyW, 62, 8) : k.rect(x, y, keyW, 62);
      k.fill();
    }
  });
  k.fillStyle = '#0c1b24';
  k.beginPath();
  k.roundRect ? k.roundRect(260, 308, 504, 58, 8) : k.rect(260, 308, 504, 58);
  k.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const k = c.getContext('2d');
  const g = k.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  k.fillStyle = g;
  k.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function buildLaptop(screenTexture) {
  const shell = new THREE.MeshStandardMaterial({ color: 0xc9d6e0, roughness: 0.32, metalness: 0.55 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0c1b24, roughness: 0.55, metalness: 0.2 });
  const laptop = new THREE.Group();

  /* base */
  const base = slab(3.3, 2.2, 0.14, 0.11, shell);
  base.rotation.x = -Math.PI / 2;
  laptop.add(base);
  const keys = new THREE.Mesh(new THREE.PlaneGeometry(2.86, 1.06), new THREE.MeshStandardMaterial({ map: keyboardTexture(), roughness: 0.7 }));
  keys.rotation.x = -Math.PI / 2;
  keys.position.set(0, 0.078, -0.32);
  laptop.add(keys);
  const pad = slab(1.05, 0.62, 0.06, 0.004, new THREE.MeshStandardMaterial({ color: 0xb8c7d3, roughness: 0.25, metalness: 0.5 }));
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, 0.078, 0.62);
  laptop.add(pad);

  /* lid, hinged at the back edge of the base */
  const hinge = new THREE.Group();
  hinge.position.set(0, 0.06, -1.06);
  const lid = new THREE.Group();
  const lidBody = slab(3.3, 2.12, 0.14, 0.07, shell);
  lidBody.position.y = 1.06;
  const bezel = slab(3.16, 1.98, 0.1, 0.01, dark);
  bezel.position.set(0, 1.06, 0.042);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.96, 1.85), new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false }));
  screen.position.set(0, 1.07, 0.08);
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.11, 32), new THREE.MeshStandardMaterial({ color: 0x7cc8f6, roughness: 0.3 }));
  logo.position.set(0, 1.06, -0.042);
  logo.rotation.y = Math.PI;
  lid.add(lidBody, bezel, screen, logo);
  hinge.add(lid);
  laptop.add(hinge);

  /* soft shadow on the "table" */
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(5.6, 4.2), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.07;
  laptop.add(shadow);

  return { laptop, hinge };
}

/* ---------- Scene ---------- */
async function start() {
  if (!heroArt || !hero || !webglAvailable()) return;
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]); } catch (e) { /* fonts optional */ }

  const canvas = document.createElement('canvas');
  canvas.className = 'hero-3d';
  canvas.setAttribute('aria-hidden', 'true');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  heroArt.appendChild(canvas);
  heroArt.classList.add('is-3d');

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xdff1ff, 0x0c1b24, 1.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x7cc8f6, 2.2);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  const lookAt = new THREE.Vector3(0, 0.75, 0);

  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  screenTexture.colorSpace = THREE.SRGBColorSpace;
  screenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  drawScreen();

  const { laptop, hinge } = buildLaptop(screenTexture);
  const rig = new THREE.Group();          /* mouse turns the rig */
  rig.add(laptop);
  scene.add(rig);

  /* BASE_TURN sets the idle angle. Keep it modest: the hero-3d canvas only
     bleeds out of .hero-art by a fixed amount (see style.css), and turning the
     laptop further toward the mouse on top of a steep base angle pushes its far
     edge past that bleed, where it gets clipped by the canvas boundary. */
  const OPEN = -0.24, CLOSED = Math.PI / 2 - 0.02, BASE_TURN = -0.12;
  const state = { lid: CLOSED, fold: 0, turnX: 0, turnY: 0 };
  const pointer = { x: 0, y: 0 };
  let visible = true;

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    /* As big as the space allows: close up by default, stepping back only when
       the laptop (about 3.9 units wide from this angle) would not fit the width. */
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fitWidth = 1.95 / (halfH * camera.aspect) * 1.04;
    /* Below this width the page's own side gutter is too narrow to give the
       close-up pose room to bleed past its box without the hero's own
       overflow:hidden clipping it as the laptop turns. Stay zoomed out there
       (matches the breakpoint on .hero-3d's bleed margin in style.css). */
    const roomy = window.innerWidth >= 1400 && camera.aspect >= 1;
    const dist = Math.max(roomy ? 6.3 : 8.2, fitWidth);
    camera.position.set(0, 2.5, dist);
    camera.lookAt(lookAt);
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(canvas);

  const render = () => {
    hinge.rotation.x = Math.min(CLOSED, state.lid + state.fold);
    rig.rotation.y = BASE_TURN + state.turnY;
    rig.rotation.x = state.turnX;
    drawScreen();
    screenTexture.needsUpdate = true;
    renderer.render(scene, camera);
  };

  if (reduceMotion || !window.gsap) {
    Object.assign(screenState, { boot: 1, typed: 1, button: 1, art: 1 });
    state.lid = OPEN;
    render();
    return;
  }

  /* Opening: the laptop rises and turns in, the lid opens, the screen boots. */
  const { gsap } = window;
  laptop.position.y = -0.9;
  laptop.rotation.y = -0.9;
  laptop.scale.setScalar(0.82);
  const tl = gsap.timeline({ delay: 0.25 });
  tl.to(laptop.position, { y: 0, duration: 1.3, ease: 'expo.out' }, 0)
    .to(laptop.rotation, { y: 0, duration: 1.6, ease: 'expo.out' }, 0)
    .to(laptop.scale, { x: 1, y: 1, z: 1, duration: 1.3, ease: 'expo.out' }, 0)
    .to(state, { lid: OPEN, duration: 1.4, ease: 'power3.inOut' }, 0.35)
    .to(screenState, { boot: 1, duration: 0.5, ease: 'power2.out' }, 1.25)
    .to(screenState, { typed: 1, duration: 1.1, ease: 'none' }, 1.5)
    .to(screenState, { art: 1, duration: 0.8, ease: 'power2.out' }, 1.7)
    .to(screenState, { button: 1, duration: 0.6, ease: 'back.out(2)' }, 2.5);
  gsap.to(screenState, { spin: 0.35, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.6 });
  gsap.to(laptop.position, { y: 0.08, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.8 });

  /* Mouse: the laptop turns toward the pointer. */
  if (finePointer) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      pointer.x = (e.clientX - r.left) / r.width - 0.5;
      pointer.y = (e.clientY - r.top) / r.height - 0.5;
    });
    hero.addEventListener('pointerleave', () => { pointer.x = 0; pointer.y = 0; });
  }

  /* Scroll: the lid folds a little as the hero leaves the screen. */
  if (window.ScrollTrigger) {
    window.ScrollTrigger.create({
      trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6,
      onUpdate: (self) => { state.fold = self.progress * 1.1; }
    });
  }

  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(hero);

  const loop = () => {
    if (visible) {
      state.turnY += (pointer.x * 0.7 - state.turnY) * 0.06;
      state.turnX += (pointer.y * 0.22 - state.turnX) * 0.06;
      render();
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

start();
