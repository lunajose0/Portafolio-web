(function () {
  'use strict';

  /* ── CUSTOM CURSOR ── */
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  let mouseX = -100, mouseY = -100, trailX = -100, trailY = -100, firstMove = false;
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = mouseX + 'px'; cursor.style.top = mouseY + 'px';
      if (!firstMove) {
        firstMove = true;
        cursor.style.opacity = '1'; trail.style.opacity = '1';
        document.documentElement.classList.add('hide-cursor');
      }
    });
    (function animateTrail() {
      trailX += (mouseX - trailX) * 0.12; trailY += (mouseY - trailY) * 0.12;
      trail.style.left = trailX + 'px'; trail.style.top = trailY + 'px';
      requestAnimationFrame(animateTrail);
    })();
    document.querySelectorAll('a, button, .cert-card, .stat-card, .contacto__cta-btn, .proyecto-card__browser').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('grow'); trail.classList.add('grow'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('grow'); trail.classList.remove('grow'); });
    });
  } else {
    cursor.style.display = 'none'; trail.style.display = 'none';
  }

  /* ── NAV SCROLL ── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

  /* ── MOBILE MENU ── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;
  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const spans = burger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false; mobileMenu.classList.remove('open'); document.body.style.overflow = '';
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  /* ── HERO TEXT REVEAL ── */
  function revealHero() {
    document.querySelectorAll('.hero__title-line').forEach((line, i) => {
      const inner = document.createElement('div');
      inner.innerHTML = line.innerHTML; line.innerHTML = ''; line.appendChild(inner);
      setTimeout(() => line.classList.add('visible'), 80 + i * 120);
    });
    document.querySelectorAll('.hero .reveal-fade').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 400 + i * 100);
    });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', revealHero) : revealHero();

  /* ── RELIABLE SCROLL ANIMATIONS ──
     threshold:0 = fires as soon as 1px enters viewport
     rootMargin:'0px' = no negative clipping
     fallback: force-show all after 1.5s
  ── */
  function makeVisible(el) {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
    el.classList.add('visible');
  }

  const OPT = { threshold: 0, rootMargin: '0px' };

  // Cert cards — stagger within grid
  const certCards = document.querySelectorAll('.cert-card');
  certCards.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
  const certObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => makeVisible(entry.target), i * 40);
        certObs.unobserve(entry.target);
      }
    });
  }, OPT);
  certCards.forEach(el => certObs.observe(el));

  // Proyecto cards — stagger
  const proyectoCards = document.querySelectorAll('.proyecto-card');
  const proyObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.index || '1');
        setTimeout(() => makeVisible(entry.target), (idx - 1) * 150);
        proyObs.unobserve(entry.target);
      }
    });
  }, OPT);
  proyectoCards.forEach(el => proyObs.observe(el));

  // General sections
  const fadeEls = document.querySelectorAll('.section__header, .sobre-mi__grid, .stack__category, .edu__card, .contacto__grid, .proyectos__intro');
  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { setTimeout(() => makeVisible(entry.target), 60); fadeObs.unobserve(entry.target); }
    });
  }, OPT);
  fadeEls.forEach(el => fadeObs.observe(el));

  // Timeline
  const timelineItems = document.querySelectorAll('.timeline__item');
  timelineItems.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  });
  const tlObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.index || '1');
        setTimeout(() => makeVisible(entry.target), (idx - 1) * 100);
        tlObs.unobserve(entry.target);
      }
    });
  }, OPT);
  timelineItems.forEach(el => tlObs.observe(el));

  // HARD FALLBACK: force everything visible after 1.5s no matter what
  setTimeout(() => {
    document.querySelectorAll('.cert-card, .section__header, .sobre-mi__grid, .stack__category, .edu__card, .contacto__grid, .timeline__item, .proyecto-card, .proyectos__intro').forEach(el => {
      if (el.style.opacity === '0' || el.style.opacity === '') makeVisible(el);
    });
  }, 1500);

  /* ── STACK BARS ── */
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('animated'); barObs.unobserve(entry.target); } });
  }, { threshold: 0 });
  document.querySelectorAll('.stack__bar').forEach(bar => barObs.observe(bar));

  /* ── COUNTERS ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target || '0');
    const start = performance.now();
    (function update(now) {
      const p = Math.min((now - start) / 1600, 1);
      el.textContent = Math.round((1 - Math.pow(2, -10 * p)) * target);
      if (p < 1) requestAnimationFrame(update); else el.textContent = target;
    })(performance.now());
  }
  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { animateCounter(entry.target); cntObs.unobserve(entry.target); } });
  }, { threshold: 0 });
  document.querySelectorAll('.stat-card__num[data-target]').forEach(c => cntObs.observe(c));

  /* ── CERT CARDS GLOW ── */
  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      const glow = card.querySelector('.cert-card__glow');
      if (glow) glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(200,240,96,0.12) 0%, transparent 60%)`;
    });
  });

  /* ── ACTIVE NAV ── */
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav__link:not(.nav__link--cta)').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('section[id]').forEach(s => sectionObs.observe(s));

  /* ── HERO FLOATS PARALLAX ── */
  const floats = document.querySelectorAll('.hero__float');
  window.addEventListener('scroll', () => {
    floats.forEach((el, i) => { el.style.transform = `translateY(${-window.scrollY * (0.08 + i * 0.03)}px)`; });
  }, { passive: true });

  /* ── TYPED LABEL ── */
  const labelEl = document.querySelector('.hero__label .label');
  if (labelEl) {
    const text = labelEl.textContent; labelEl.textContent = ''; labelEl.style.opacity = '1'; let i = 0;
    const go = () => { const iv = setInterval(() => { labelEl.textContent += text[i++]; if (i >= text.length) clearInterval(iv); }, 22); };
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', go) : go();
  }

  /* ── NAV ACTIVE STYLE ── */
  const s = document.createElement('style');
  s.textContent = `.nav__link.active { color: var(--text); } .nav__link.active::after { width: 100%; }`;
  document.head.appendChild(s);

})();

/* ── CERT MODAL ── */
(function() {
  const modal    = document.getElementById('certModal');
  const backdrop = document.getElementById('certModalBackdrop');
  const closeBtn = document.getElementById('certModalClose');
  const iframe   = document.getElementById('certModalIframe');

  function openModal(src) {
    iframe.src = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { iframe.src = ''; }, 300);
  }

  document.querySelectorAll('.cert-card[data-cert]').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.cert));
  });

  backdrop.addEventListener('click', closeModal);
  closeBtn.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();
