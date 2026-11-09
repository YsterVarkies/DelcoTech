/*
 * DelcoTech website chat widget.
 *
 * The launcher is the glossy, gently morphing AI orb from the DelcoTech ad
 * ("Meet your custom AI", 0:44), ported from the video's <Orb> component
 * (delcotech-video/src/components/core.tsx). Clicking it ripples, squashes and
 * bursts open into the chat window. The same orb lives on as the assistant's
 * avatar in the chat header, and it speeds up while the assistant is thinking.
 *
 * CHAT_ENDPOINT is the deployed Cloudflare Worker (see chat-worker/README.md).
 */
(function () {
  const CHAT_ENDPOINT = 'https://delcotech-chat.deliusschoeman-ds.workers.dev';
  const STORAGE_KEY = 'delcotech-chat';
  const PEEK_KEY = 'delcotech-chat-peek';
  const GREETING = 'Hi! I’m the DelcoTech assistant. Ask me about our websites, software, AI, prices or how a project works.';
  const FALLBACK = 'For anything else, WhatsApp us on +27 79 208 2578 or email info@delcotech.co.za.';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const EASE_OUT = 'cubic-bezier(.16,1,.3,1)';
  const EASE_IN = 'cubic-bezier(.7,0,.84,0)';
  const EASE_IN_OUT = 'cubic-bezier(.65,0,.35,1)';

  /* ------------------------------------------------------------------ */
  /* The orb                                                              */
  /* ------------------------------------------------------------------ */

  // Seeded 2D simplex noise in the range -1..1 (the same kind of noise the video uses).
  function makeNoise(seed) {
    let h = 1779033703 ^ seed.length;
    for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    let s = h >>> 0;
    const rand = () => {
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const p = Array.from({ length: 256 }, (_, i) => i);
    for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); const tmp = p[i]; p[i] = p[j]; p[j] = tmp; }
    const perm = new Uint8Array(512);
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
    const G = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const F2 = 0.5 * (Math.sqrt(3) - 1), G2 = (3 - Math.sqrt(3)) / 6;
    const corner = (x, y, g) => { let t = 0.5 - x * x - y * y; if (t < 0) return 0; t *= t; const v = G[g & 7]; return t * t * (v[0] * x + v[1] * y); };
    return (x, y) => {
      const k = (x + y) * F2, i = Math.floor(x + k), j = Math.floor(y + k);
      const u = (i + j) * G2, x0 = x - i + u, y0 = y - j + u;
      const i1 = x0 > y0 ? 1 : 0, j1 = 1 - i1;
      const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2, x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2;
      const ii = i & 255, jj = j & 255;
      return 70 * (corner(x0, y0, perm[ii + perm[jj]]) + corner(x1, y1, perm[ii + i1 + perm[jj + j1]]) + corner(x2, y2, perm[ii + 1 + perm[jj + 1]]));
    };
  }
  const noiseA = makeNoise('orb-a');
  const noiseB = makeNoise('orb-b');
  const f = n => n.toFixed(2);

  // A smooth closed blob through 9 noisy points (Catmull-Rom to Bezier), as in the video.
  function blobPath(noise, t, r, c, wobble) {
    const n = 9, pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const k = 1 + wobble * noise(Math.cos(a) * 0.8 + t * 0.32, Math.sin(a) * 0.8 - t * 0.21);
      pts.push([c + Math.cos(a) * r * k, c + Math.sin(a) * r * k]);
    }
    let d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]);
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i + n - 1) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += 'C' + f(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        f(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f(p2[0]) + ' ' + f(p2[1]);
    }
    return d + 'Z';
  }

  const orbs = [];
  function createOrb(size, wobble, offset) {
    const id = 'dt-orb-' + orbs.length;
    const r = size * 0.36, c = size / 2;
    const wrap = document.createElement('span');
    wrap.className = 'dt-orb';
    wrap.innerHTML =
      '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true" focusable="false">' +
        '<defs>' +
          '<radialGradient id="' + id + '-fill" cx="36%" cy="30%" r="78%">' +
            '<stop offset="0%" stop-color="#f2fbff"/><stop offset="28%" stop-color="#a9dcfb"/>' +
            '<stop offset="55%" stop-color="#4fb0ee"/><stop offset="82%" stop-color="#2f6fb0"/>' +
            '<stop offset="100%" stop-color="#24427a"/>' +
          '</radialGradient>' +
          '<radialGradient id="' + id + '-glow">' +
            '<stop offset="0%" stop-color="#7cc8f6" stop-opacity=".55"/><stop offset="100%" stop-color="#7cc8f6" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + id + '-rim" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0%" stop-color="#fff" stop-opacity=".7"/><stop offset="100%" stop-color="#fff" stop-opacity=".05"/>' +
          '</linearGradient>' +
          '<filter id="' + id + '-soft" x="-50%" y="-50%" width="200%" height="200%">' +
            '<feGaussianBlur stdDeviation="' + f(size * 0.012) + '"/>' +
          '</filter>' +
        '</defs>' +
        '<circle cx="' + c + '" cy="' + c + '" r="' + f(r * 1.9) + '" fill="url(#' + id + '-glow)"/>' +
        '<path class="orb-back" fill="#7cc8f6" fill-opacity=".22"/>' +
        '<path class="orb-body" fill="url(#' + id + '-fill)"/>' +
        '<path class="orb-rim" fill="none" stroke="url(#' + id + '-rim)" stroke-width="' + f(Math.max(0.8, size * 0.008)) + '"/>' +
        '<ellipse cx="' + f(c - r * 0.32) + '" cy="' + f(c - r * 0.42) + '" rx="' + f(r * 0.38) + '" ry="' + f(r * 0.22) + '" fill="#fff" fill-opacity=".55" filter="url(#' + id + '-soft)"/>' +
      '</svg>';
    const svg = wrap.firstChild;
    const back = svg.querySelector('.orb-back'), body = svg.querySelector('.orb-body'), rim = svg.querySelector('.orb-rim');
    const orb = {
      el: wrap,
      active: true,
      time: offset || 0,
      speed: 1, targetSpeed: 1,
      wobble: wobble, targetWobble: wobble,
      render() {
        const shape = blobPath(noiseA, this.time, r, c, this.wobble);
        body.setAttribute('d', shape);
        rim.setAttribute('d', shape);
        back.setAttribute('d', blobPath(noiseB, this.time + 7, r * 1.08, c, this.wobble * 1.4));
        svg.style.transform = 'scale(' + (1 + Math.sin(this.time * 2.2) * 0.018).toFixed(4) + ')'; // breathing
      },
      // livelier while hovered or thinking
      excite(on) { this.targetSpeed = on ? 2.6 : 1; this.targetWobble = on ? wobble * 1.6 : wobble; }
    };
    orb.render();
    orbs.push(orb);
    return orb;
  }

  let rafId = 0, last = 0;
  function frame(now) {
    rafId = requestAnimationFrame(frame);
    const dt = (now - last) / 1000;
    if (dt < 1 / 30) return; // ~30 fps is plenty for a slow morph and easy on batteries
    last = now;
    const step = Math.min(dt, 0.1);
    orbs.forEach(o => {
      if (!o.active) return;
      o.speed += (o.targetSpeed - o.speed) * 0.08;
      o.wobble += (o.targetWobble - o.wobble) * 0.08;
      o.time += step * o.speed;
      o.render();
    });
  }
  function syncLoop() {
    if (reduceMotion.matches) { cancelAnimationFrame(rafId); rafId = 0; return; }
    if (!rafId) { last = performance.now(); rafId = requestAnimationFrame(frame); }
  }
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', syncLoop);
  else if (reduceMotion.addListener) reduceMotion.addListener(syncLoop);

  /* ------------------------------------------------------------------ */
  /* Chat window                                                          */
  /* ------------------------------------------------------------------ */

  let history = [];
  try { history = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || []; } catch (e) { history = []; }
  const save = () => { try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-20))); } catch (e) {} };

  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; };

  // Launcher: the orb
  const launcher = el('button', 'chat-orb');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'chat-panel');
  launcher.setAttribute('aria-label', 'Chat with the DelcoTech assistant');
  const ripple = el('span', 'chat-orb-ripple');
  const orbBox = el('span', 'chat-orb-body');
  const launcherOrb = createOrb(84, 0.09);
  orbBox.append(launcherOrb.el);
  const tip = el('span', 'chat-orb-tip', 'Ask us');
  tip.setAttribute('aria-hidden', 'true');
  launcher.append(ripple, orbBox, tip);

  const panel = el('section', 'chat-panel');
  panel.id = 'chat-panel';
  panel.hidden = true;
  panel.setAttribute('aria-label', 'DelcoTech chat assistant');

  const head = el('div', 'chat-head');
  const avatar = el('span', 'chat-avatar');
  const headOrb = createOrb(46, 0.08, 3.7);
  headOrb.active = false;
  avatar.append(headOrb.el);
  const title = el('div', 'chat-title');
  title.append(el('strong', '', 'DelcoTech assistant'), el('small', '', 'AI answers · can make mistakes'));
  const close = el('button', 'chat-close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close chat');
  close.textContent = '×';
  head.append(avatar, title, close);

  const log = el('div', 'chat-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');

  const form = el('form', 'chat-form');
  const label = el('label', 'visually-hidden', 'Your message');
  label.htmlFor = 'chat-input';
  const input = el('textarea');
  input.id = 'chat-input';
  input.rows = 1;
  input.maxLength = 1000;
  input.placeholder = 'Type your question…';
  const send = el('button', 'chat-send');
  send.type = 'submit';
  send.setAttribute('aria-label', 'Send message');
  send.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  form.append(label, input, send);

  const note = el('p', 'chat-note', FALLBACK);
  panel.append(head, log, form, note);
  document.body.append(launcher, panel);
  syncLoop();

  function bubble(role, text) {
    const b = el('div', 'chat-msg chat-' + role, text);
    log.append(b);
    log.scrollTop = log.scrollHeight;
    return b;
  }
  function render() {
    log.textContent = '';
    bubble('assistant', GREETING);
    history.forEach(m => bubble(m.role, m.content));
  }

  // A one-time "Ask us" hint next to the orb, so visitors know what it is.
  let peekTimer = 0;
  function hidePeek() { clearTimeout(peekTimer); launcher.classList.remove('peek'); }
  try {
    if (!sessionStorage.getItem(PEEK_KEY)) {
      peekTimer = setTimeout(() => {
        launcher.classList.add('peek');
        try { sessionStorage.setItem(PEEK_KEY, '1'); } catch (e) {}
        peekTimer = setTimeout(hidePeek, 4500);
      }, 2500);
    }
  } catch (e) {}

  launcher.addEventListener('pointerenter', () => launcherOrb.excite(true));
  launcher.addEventListener('pointerleave', () => launcherOrb.excite(false));

  /* ------------------------------------------------------------------ */
  /* Open and close: the orb bursts into the chat window and back        */
  /* ------------------------------------------------------------------ */

  let state = 'closed'; // closed | opening | open | closing

  // A circle centred on the orb, from nothing to just big enough to cover the window.
  function revealCircle() {
    const p = panel.getBoundingClientRect(), b = launcher.getBoundingClientRect();
    const x = b.left + b.width / 2 - p.left, y = b.top + b.height / 2 - p.top;
    const radius = Math.hypot(Math.max(x, p.width - x), Math.max(y, p.height - y));
    const at = ' at ' + f(x) + 'px ' + f(y) + 'px)';
    return ['circle(0px' + at, 'circle(' + f(radius) + 'px' + at];
  }

  function focusInside() { (finePointer.matches ? input : close).focus({ preventScroll: true }); }

  function openChat() {
    if (state !== 'closed') return;
    state = 'opening';
    hidePeek();
    if (!log.childElementCount) render();
    panel.hidden = false;
    headOrb.active = true;
    launcher.setAttribute('aria-expanded', 'true');
    const done = () => { state = 'open'; launcher.classList.add('is-hidden'); launcherOrb.active = false; };
    if (reduceMotion.matches) { done(); focusInside(); return; }

    launcherOrb.excite(false);
    const [from, to] = revealCircle();
    ripple.animate([{ transform: 'scale(.7)', opacity: 0.6 }, { transform: 'scale(2.4)', opacity: 0 }], { duration: 700, easing: EASE_OUT });
    orbBox.getAnimations().forEach(a => a.cancel());
    orbBox.animate([
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(.84)', opacity: 1, offset: 0.25 },
      { transform: 'scale(1.16)', opacity: 1, offset: 0.55 },
      { transform: 'scale(.35)', opacity: 0 }
    ], { duration: 560, easing: EASE_IN_OUT, fill: 'forwards' });
    const grow = panel.animate([
      { clipPath: from, transform: 'translateY(12px)' },
      { clipPath: to, transform: 'translateY(0)' }
    ], { duration: 640, delay: 160, easing: EASE_OUT, fill: 'backwards' });
    [avatar, title].concat(Array.from(log.children).slice(-4), form).forEach((node, i) => {
      node.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 450, delay: 300 + i * 60, easing: EASE_OUT, fill: 'backwards' });
    });
    focusInside();
    grow.finished.then(done, done);
  }

  function closeChat() {
    if (state !== 'open') return;
    state = 'closing';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.classList.remove('is-hidden');
    launcherOrb.active = true;
    const done = () => { panel.hidden = true; headOrb.active = false; state = 'closed'; };
    if (reduceMotion.matches) { orbBox.getAnimations().forEach(a => a.cancel()); done(); launcher.focus(); return; }

    const [from, to] = revealCircle();
    const shrink = panel.animate([
      { clipPath: to, transform: 'translateY(0)' },
      { clipPath: from, transform: 'translateY(12px)' }
    ], { duration: 420, easing: EASE_IN, fill: 'forwards' });
    orbBox.getAnimations().forEach(a => a.cancel());
    orbBox.animate([
      { transform: 'scale(.35)', opacity: 0 },
      { transform: 'scale(1.12)', opacity: 1, offset: 0.6 },
      { transform: 'scale(1)', opacity: 1 }
    ], { duration: 520, delay: 300, easing: EASE_OUT, fill: 'backwards' });
    launcher.focus({ preventScroll: true });
    shrink.finished.then(() => { done(); shrink.cancel(); }, done);
  }

  launcher.addEventListener('click', openChat);
  close.addEventListener('click', closeChat);
  panel.addEventListener('keydown', e => { if (e.key === 'Escape') closeChat(); });

  /* ------------------------------------------------------------------ */
  /* Sending messages                                                     */
  /* ------------------------------------------------------------------ */

  input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; });
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });

  let busy = false;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy) return;
    busy = true; send.disabled = true;
    input.value = ''; input.style.height = 'auto';
    history.push({ role: 'user', content: text }); save();
    bubble('user', text);
    const typing = bubble('assistant chat-typing', '');
    typing.setAttribute('aria-label', 'Assistant is typing');
    typing.append(el('i'), el('i'), el('i'));
    headOrb.excite(true);

    let reply, failed = false;
    try {
      if (!CHAT_ENDPOINT) throw new Error('The chat assistant isn’t switched on yet. ' + FALLBACK);
      const res = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(data.error || 'Something went wrong. ' + FALLBACK);
      reply = data.reply;
    } catch (err) {
      failed = true;
      reply = err && err.message && !/fetch|network/i.test(err.message) ? err.message : 'I can’t connect right now. ' + FALLBACK;
    }
    headOrb.excite(false);
    typing.remove();
    if (failed) {
      history.pop(); save(); // let the visitor resend the same question later
      bubble('assistant chat-error', reply);
    } else {
      history.push({ role: 'assistant', content: reply }); save();
      bubble('assistant', reply);
    }
    busy = false; send.disabled = false; input.focus();
  });
})();
