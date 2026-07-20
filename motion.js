/* ============================================================
   Adkrak — motion + interaction primitives
   Vanilla JS, no dependencies. Works on all modern browsers.
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Preloader ---------- */
  window.addEventListener('load', () => {
    const pre = document.querySelector('.preloader');
    if (!pre) return;
    setTimeout(() => pre.classList.add('hidden'), 400);
  });

  /* ---------- Custom cursor ---------- */
  const glow = document.querySelector('.cursor-glow');
  const dot  = document.querySelector('.cursor-dot');
  if (glow && dot && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.15;
      cy += (ty - cy) * 0.15;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      dot.style.transform  = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    })();

    /* Cursor grows on interactive elements */
    document.querySelectorAll('a, button, .magnetic, input, select, textarea, .card-lux').forEach(el => {
      el.addEventListener('mouseenter', () => { dot.style.width = '40px'; dot.style.height = '40px'; dot.style.opacity = '0.6'; });
      el.addEventListener('mouseleave', () => { dot.style.width = '8px'; dot.style.height = '8px'; dot.style.opacity = '1'; });
    });
  }

  /* ---------- Scroll navbar ---------- */
  const nav = document.querySelector('.nav-blur');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll (IntersectionObserver) ---------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-words, .stagger');
  if (revealElements.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach((el) => io.observe(el));
  }

  /* ---------- Word-by-word wrap for reveal-words (DOM walker, preserves inline tags) ---------- */
  const wrapTextNode = (node) => {
    const parts = node.textContent.split(/(\s+)/);
    const frag = document.createDocumentFragment();
    parts.forEach((p) => {
      if (!p) return;
      if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
      const w = document.createElement('span');
      w.className = 'word';
      w.textContent = p;
      frag.appendChild(w);
    });
    node.parentNode.replaceChild(frag, node);
  };
  const walkAndWrap = (root) => {
    const kids = Array.from(root.childNodes);
    kids.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        if (n.textContent.trim()) wrapTextNode(n);
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        if (n.tagName === 'BR') return;
        if (n.classList && n.classList.contains('word')) return;
        walkAndWrap(n);
      }
    });
  };
  document.querySelectorAll('.reveal-words').forEach((el) => {
    if (el.dataset.wordsWrapped) return;
    walkAndWrap(el);
    el.dataset.wordsWrapped = '1';
  });

  /* ---------- Card spotlight (cursor-tracked radial glow) ---------- */
  document.querySelectorAll('.card-lux').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ---------- 3D tilt for .tilt elements ---------- */
  if (!reduceMotion) {
    document.querySelectorAll('.tilt').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', (py * -6) + 'deg');
        el.style.setProperty('--ry', (px * 8) + 'deg');
      });
      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = e.clientX - r.left - r.width / 2;
        const py = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${px * 0.2}px, ${py * 0.25}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------- Number counter (data-count="123") ---------- */
  const counters = document.querySelectorAll('.counter[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const duration = 1400;
        const startTime = performance.now();
        const startVal = 0;
        const format = el.dataset.format || '';
        const step = (now) => {
          const t = Math.min(1, (now - startTime) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const cur = Math.round(startVal + (target - startVal) * eased);
          el.textContent = cur.toLocaleString('en-IN') + format;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Parallax orbs ---------- */
  const orbs = document.querySelectorAll('[data-parallax]');
  if (orbs.length && !reduceMotion) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      lastY = window.scrollY;
    }, { passive: true });
    (function paraLoop() {
      orbs.forEach((orb) => {
        const speed = parseFloat(orb.dataset.parallax) || 0.15;
        orb.style.transform = `translateY(${lastY * -speed}px)`;
      });
      requestAnimationFrame(paraLoop);
    })();
  }

})();
