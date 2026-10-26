/*
 * DelcoTech motion layer (GSAP 3 + ScrollTrigger + SplitText, shipped in assets/vendor).
 * Adds the intro, scroll reveals, hover effects and mouse parallax on top of the page.
 * Everything is skipped when the visitor asks for reduced motion, and the page works
 * normally if these scripts fail to load.
 */
(function () {
  const root = document.documentElement;
  const showPage = () => root.classList.remove('motion-pending');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !window.gsap || !window.ScrollTrigger) { showPage(); return; }

  const { gsap, ScrollTrigger } = window;
  const hasSplit = !!window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (hasSplit) gsap.registerPlugin(window.SplitText);

  const q = (sel, scope = document) => scope.querySelector(sel);
  const qa = (sel, scope = document) => [...scope.querySelectorAll(sel)];
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const EASE = 'expo.out';

  /* Splits a heading into masked lines so each line can rise into view. */
  const splitLines = (el) => {
    if (!el) return [];
    if (!hasSplit) return [el];
    return window.SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'line-mask-inner' }).lines;
  };

  /* Moves an element with the CSS `translate` property, so it never fights the
     element's own CSS transform (rotations and scales stay as designed). */
  const translator = (el, duration = 0.9) => {
    if (!el) return () => {};
    const pos = { x: 0, y: 0 };
    const apply = () => { el.style.translate = pos.x.toFixed(2) + 'px ' + pos.y.toFixed(2) + 'px'; };
    const toX = gsap.quickTo(pos, 'x', { duration, ease: 'power3.out', onUpdate: apply });
    const toY = gsap.quickTo(pos, 'y', { duration, ease: 'power3.out', onUpdate: apply });
    return (x, y) => { toX(x); toY(y); };
  };

  const fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((resolve) => setTimeout(resolve, 900))
  ]);

  fontsReady.then(() => {
    /* ---------- Setup that the effects below rely on ---------- */
    const heroArt = q('.hero-art');
    const windowEl = q('.website-window');
    let tilt = null;
    if (windowEl) {
      tilt = document.createElement('div');
      tilt.className = 'window-tilt';
      windowEl.parentNode.insertBefore(tilt, windowEl);
      tilt.appendChild(windowEl);
    }
    const hero = q('.hero');
    const spot = document.createElement('div');
    spot.className = 'hero-spot';
    spot.setAttribute('aria-hidden', 'true');
    if (hero) hero.appendChild(spot);


    /* ---------- 1. Opening sequence ---------- */
    /* The mouse tilt waits until the window has landed, so the two never fight over it. */
    let introDone = false;
    const intro = gsap.timeline({ defaults: { ease: EASE } });
    intro
      .from('.site-header .brand', { x: -24, opacity: 0, duration: 0.9 }, 0)
      .from('.main-nav > a, .menu-toggle', { y: -16, opacity: 0, duration: 0.8, stagger: 0.06 }, 0.1)
      .from('.hero .eyebrow', { y: 14, opacity: 0, duration: 0.8 }, 0.15)
      .from(splitLines(q('#hero-title')), { yPercent: 110, rotation: 2, duration: 1.15, stagger: 0.12 }, 0.2)
      .from('.hero-description', { y: 26, opacity: 0, duration: 1 }, 0.55)
      .from('.hero-actions > *', { y: 22, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.65)
      .from('.hero-footnotes > span', { y: 14, opacity: 0, duration: 0.8, stagger: 0.07 }, 0.8)
      .from('.orbit', { scale: 0.6, opacity: 0, duration: 1.6, stagger: 0.15, clearProps: 'transform' }, 0.2)
      .from(windowEl, { y: 90, rotationX: 28, scale: 0.9, opacity: 0, duration: 1.05, clearProps: 'transform,opacity', onComplete: () => { introDone = true; } }, 0.15)
      .from('.mock-copy > *', { y: 14, opacity: 0, duration: 0.8, stagger: 0.07 }, 0.9)
      .from('.mock-art > *', { scale: 0, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'back.out(1.8)', clearProps: 'transform' }, 1)
      .from('.floating-note', { y: 30, scale: 0.6, opacity: 0, duration: 1, stagger: 0.18, ease: 'back.out(1.7)', clearProps: 'transform' }, 1.05)
      .from('.spark', { scale: 0, rotation: -140, opacity: 0, duration: 1.2, stagger: 0.12, clearProps: 'transform' }, 1.1)
      .from('.hero-bottom > span', { y: 12, opacity: 0, duration: 0.8, stagger: 0.1 }, 1.1);
    showPage();

    /* Gentle idle movement in the hero */
    qa('.floating-note').forEach((note, i) => {
      gsap.to(note, { y: i ? 9 : -10, duration: 2.6 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.8 + i * 0.4 });
    });
    qa('.spark').forEach((spark, i) => {
      gsap.to(spark, { rotation: i ? -360 : 360, duration: 16 + i * 6, ease: 'none', repeat: -1, delay: 2.8 });
    });
    gsap.to('.mock-art-dot', { y: -8, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.2 });

    /* ---------- 2. Mouse parallax in the hero ---------- */
    if (finePointer && hero && heroArt) {
      const layers = [
        [q('.note-top'), 34], [q('.note-bottom'), 46],
        [q('.orbit-one'), 12], [q('.orbit-two'), 7],
        [q('.spark-one'), 52], [q('.spark-two'), 40],
        [q('.mock-art-disc'), 12], [q('.mock-art-pill'), 20], [q('.mock-art-curve'), 8], [q('.mock-art-dot'), 26],
        [q('.hero-copy'), -10]
      ].filter(([el]) => el).map(([el, depth]) => [translator(el, 1), depth]);
      const tiltX = gsap.quickTo(tilt, 'rotationX', { duration: 1, ease: 'power3.out' });
      const tiltY = gsap.quickTo(tilt, 'rotationY', { duration: 1, ease: 'power3.out' });
      const spotX = gsap.quickTo(spot, 'x', { duration: 0.7, ease: 'power3.out' });
      const spotY = gsap.quickTo(spot, 'y', { duration: 0.7, ease: 'power3.out' });
      gsap.set(tilt, { transformPerspective: 1100 });

      hero.addEventListener('pointerenter', () => gsap.to(spot, { opacity: 1, duration: 0.6 }));
      hero.addEventListener('pointermove', (e) => {
        const box = hero.getBoundingClientRect();
        const nx = (e.clientX - box.left) / box.width - 0.5;   /* -0.5 … 0.5 */
        const ny = (e.clientY - box.top) / box.height - 0.5;
        layers.forEach(([move, depth]) => move(nx * depth, ny * depth));
        if (introDone) { tiltY(nx * 16); tiltX(-ny * 12); }
        spotX(e.clientX - box.left);
        spotY(e.clientY - box.top);
      });
      hero.addEventListener('pointerleave', () => {
        layers.forEach(([move]) => move(0, 0));
        tiltX(0); tiltY(0);
        gsap.to(spot, { opacity: 0, duration: 0.6 });
      });
    }

    /* The hero drifts apart as you scroll away from it */
    gsap.to(heroArt, { yPercent: -14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { yPercent: 10, opacity: 0.35, ease: 'none', scrollTrigger: { trigger: hero, start: 'center top', end: 'bottom top', scrub: true } });

    /* ---------- 3. Section headings rise line by line ---------- */
    const revealOnce = (targets, vars, trigger, start = 'top 86%') => {
      if (!targets || (Array.isArray(targets) && !targets.length)) return;
      gsap.from(targets, { ...vars, scrollTrigger: { trigger, start, toggleActions: 'play none none none' } });
    };
    qa('.section-header, .process-heading, .faq-layout > div:first-child, .feature-copy, .contact-copy').forEach((block) => {
      const eyebrow = q('.eyebrow', block);
      const heading = q('h2', block);
      const rest = qa(':scope > p, :scope > .section-intro, :scope > a, :scope > .button, .feature-points > div, .contact-separator, .contact-direct, :scope > .contact-note', block);
      const tl = gsap.timeline({ scrollTrigger: { trigger: block, start: 'top 84%', toggleActions: 'play none none none' }, defaults: { ease: EASE } });
      if (eyebrow) tl.from(eyebrow, { x: -24, opacity: 0, duration: 0.8 }, 0);
      if (heading) tl.from(splitLines(heading), { yPercent: 110, rotation: 1.5, duration: 1.1, stagger: 0.1 }, 0.08);
      if (rest.length) tl.from(rest, { y: 24, opacity: 0, duration: 0.9, stagger: 0.07 }, 0.35);
    });

    /* The blue line under "what's next." starts short and grows as you scroll down */
    qa('.underline-green').forEach((line) => {
      gsap.fromTo(line, { '--underline': 0.08 }, { '--underline': 1, ease: 'none', scrollTrigger: { trigger: line, start: 'top 90%', end: 'top 60%', scrub: 0.5 } });
    });

    /* Value strip */
    revealOnce('.value-grid > div', { y: 30, opacity: 0, duration: 1, stagger: 0.12, ease: EASE }, '.value-strip', 'top 92%');

    /* ---------- 4. Cards deal in, then tilt under the mouse ---------- */
    const dealIn = (selector, extra = {}) => {
      const cards = qa(selector);
      if (!cards.length) return;
      gsap.set(cards, { opacity: 0, y: 70, rotationX: -14, transformPerspective: 900, transformOrigin: '50% 100%' });
      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        onEnter: (batch) => {
          const fresh = batch.filter((el) => !el.dataset.shown);
          if (!fresh.length) return;
          fresh.forEach((el) => { el.dataset.shown = '1'; });
          gsap.to(fresh, { opacity: 1, y: 0, rotationX: 0, duration: 1.1, stagger: 0.1, ease: EASE, overwrite: true, ...extra });
        }
      });
    };
    dealIn('.service-card');
    dealIn('.pricing-card');

    const tiltCard = (card, strength) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      const lift = gsap.quickTo(card, 'y', { duration: 0.6, ease: 'power3.out' });
      card.addEventListener('pointerenter', () => { gsap.set(card, { transformPerspective: 900 }); lift(-8); });
      card.addEventListener('pointermove', (e) => {
        const box = card.getBoundingClientRect();
        const nx = (e.clientX - box.left) / box.width;
        const ny = (e.clientY - box.top) / box.height;
        card.style.setProperty('--mx', (nx * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (ny * 100).toFixed(1) + '%');
        ry((nx - 0.5) * strength);
        rx(-(ny - 0.5) * strength * 0.8);
      });
      card.addEventListener('pointerleave', () => { rx(0); ry(0); lift(0); });
    };
    if (finePointer) {
      qa('.service-card').forEach((card) => {
        tiltCard(card, 12);
        const icon = q('.service-icon', card);
        card.addEventListener('pointerenter', () => gsap.to(icon, { scale: 1.1, duration: 0.5, ease: 'back.out(2)' }));
        card.addEventListener('pointerleave', () => gsap.to(icon, { scale: 1, duration: 0.5, ease: 'power3.out' }));
      });
      qa('.pricing-card:not(.quote-card)').forEach((card) => tiltCard(card, 7));
      qa('.pricing-card.quote-card').forEach((card) => tiltCard(card, 3));
    }

    /* Prices count up the first time they appear */
    qa('.pricing-card .price').forEach((el) => {
      const match = el.textContent.match(/^(\D*)([\d,]+)(.*)$/);
      if (!match) return;
      const [, before, digits, after] = match;
      const target = parseInt(digits.replace(/,/g, ''), 10);
      const counter = { n: 0 };
      const write = () => { el.textContent = before + Math.round(counter.n).toLocaleString('en-US') + after; };
      ScrollTrigger.create({
        trigger: el, start: 'top 92%',
        onEnter: () => {
          if (el.dataset.counted) return;
          el.dataset.counted = '1';
          gsap.to(counter, { n: target, duration: 1.6, ease: 'power3.out', onUpdate: write });
        }
      });
    });
    revealOnce('.pricing-card .popular', { scale: 0, opacity: 0, duration: 0.7, ease: 'back.out(2)', delay: 0.6, transformOrigin: '100% 0%' }, '.pricing-card.featured');
    qa('.pricing-group-title').forEach((t) => revealOnce(t.children, { y: 18, opacity: 0, duration: 0.8, stagger: 0.08, ease: EASE }, t));
    revealOnce('.pricing-note', { y: 16, opacity: 0, duration: 0.9, ease: EASE }, '.pricing-note', 'top 95%');

    /* ---------- 5. About section: depth that follows the mouse ---------- */
    const featureVisual = q('.feature-visual');
    if (featureVisual) {
      const ftl = gsap.timeline({ scrollTrigger: { trigger: featureVisual, start: 'top 80%', toggleActions: 'play none none none' }, defaults: { ease: EASE } });
      ftl.from('.feature-halo', { opacity: 0, duration: 1.4 }, 0)
        .from('.feature-circle', { opacity: 0, duration: 1.2, stagger: 0.15 }, 0)
        .from('.feature-center', { opacity: 0, duration: 1.2 }, 0.2)
        .from('.feature-center-symbol', { scale: 0.4, rotation: -30, duration: 1.3, ease: 'back.out(1.6)' }, 0.25)
        .from('.feature-mini-top', { x: 60, opacity: 0, duration: 1 }, 0.5)
        .from('.feature-mini-bottom', { x: -60, opacity: 0, duration: 1 }, 0.6);
      gsap.to(featureVisual, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.feature-section', start: 'top bottom', end: 'bottom top', scrub: true } });

      if (finePointer) {
        const section = q('.feature-section');
        const fLayers = [
          [q('.feature-circle-one'), 10], [q('.feature-circle-two'), 18], [q('.feature-halo'), 6],
          [q('.feature-center'), 26], [q('.feature-mini-top'), 44], [q('.feature-mini-bottom'), 38]
        ].filter(([el]) => el).map(([el, depth]) => [translator(el, 1.1), depth]);
        section.addEventListener('pointermove', (e) => {
          const box = section.getBoundingClientRect();
          const nx = (e.clientX - box.left) / box.width - 0.5;
          const ny = (e.clientY - box.top) / box.height - 0.5;
          fLayers.forEach(([move, depth]) => move(nx * depth, ny * depth));
        });
        section.addEventListener('pointerleave', () => fLayers.forEach(([move]) => move(0, 0)));
      }
    }

    /* ---------- 6. How it works: a line fills as you scroll the steps ---------- */
    const steps = q('#steps-list');
    if (steps) {
      const track = document.createElement('span');
      track.className = 'process-track';
      track.setAttribute('aria-hidden', 'true');
      const fill = document.createElement('span');
      fill.className = 'process-fill';
      track.appendChild(fill);
      steps.appendChild(track);
      gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: steps, start: 'top 70%', end: 'bottom 55%', scrub: 0.6 } });
      qa('li', steps).forEach((li) => {
        gsap.from(li, { x: 50, opacity: 0, duration: 1, ease: EASE, scrollTrigger: { trigger: li, start: 'top 90%', toggleActions: 'play none none none' } });
        gsap.from(q('.process-number', li), { scale: 0.4, opacity: 0, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: li, start: 'top 90%', toggleActions: 'play none none none' } });
        ScrollTrigger.create({ trigger: li, start: 'top 62%', end: 'bottom 62%', toggleClass: 'is-active' });
      });
    }

    /* ---------- 7. FAQ answers glide open and closed ---------- */
    qa('.faq-items details').forEach((details) => {
      const summary = q('summary', details);
      const answer = q('p', details);
      if (!summary || !answer) return;
      summary.addEventListener('click', (e) => {
        e.preventDefault();
        if (details.dataset.animating) return;
        details.dataset.animating = '1';
        const plus = q('.faq-plus', details);
        if (!details.open) {
          details.open = true;
          gsap.fromTo(answer, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.55, ease: 'power3.out', clearProps: 'height', onComplete: () => delete details.dataset.animating });
          if (plus) gsap.fromTo(plus, { scale: 0.8 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
        } else {
          gsap.to(answer, { height: 0, opacity: 0, duration: 0.4, ease: 'power3.inOut', onComplete: () => { details.open = false; gsap.set(answer, { clearProps: 'height,opacity' }); delete details.dataset.animating; } });
        }
      });
    });
    revealOnce('.faq-items details', { y: 22, opacity: 0, duration: 0.9, stagger: 0.07, ease: EASE }, '.faq-items');

    /* ---------- 8. Contact and footer ---------- */
    revealOnce('.contact-card', { x: 70, rotation: 2, opacity: 0, duration: 1.3, ease: EASE, clearProps: 'transform' }, '.contact-section', 'top 75%');
    revealOnce('.contact-card .form-heading > *, .contact-card .field', { y: 18, opacity: 0, duration: 0.8, stagger: 0.05, ease: EASE, delay: 0.35 }, '.contact-section', 'top 75%');
    revealOnce('.contact-card .form-submit', { opacity: 0, duration: 0.8, ease: EASE, delay: 0.5 }, '.contact-section', 'top 75%');
    revealOnce('.footer-main > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, ease: EASE }, '.site-footer', 'top 95%');

    /* ---------- 9. Magnetic buttons and links ---------- */
    if (finePointer) {
      qa('.button:not(.form-submit), .nav-cta, .price-button, .back-top, .service-link, .text-link').forEach((el) => {
        el.classList.add('magnetic');
        const strength = el.matches('.service-link, .text-link, .back-top') ? 0.25 : 0.35;
        const clamp = gsap.utils.clamp(-14, 14);
        const mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        const my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
        el.addEventListener('pointermove', (e) => {
          const box = el.getBoundingClientRect();
          mx(clamp((e.clientX - (box.left + box.width / 2)) * strength));
          my(clamp((e.clientY - (box.top + box.height / 2)) * strength));
        });
        el.addEventListener('pointerleave', () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
        });
      });
    }

    /* Pictures and fonts can change the page height after load: measure again. */
    ScrollTrigger.refresh();
    window.addEventListener('load', () => ScrollTrigger.refresh());
  });
})();
