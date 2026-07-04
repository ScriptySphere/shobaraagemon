/* =========================================================
   Shobar Aage Mon — Shared Behaviors
   Small, dependency-free. Respects prefers-reduced-motion.
   ========================================================= */

(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nav: sticky background + mobile toggle ---- */
  const nav = document.querySelector('[data-nav]');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const toggle = nav.querySelector('[data-nav-toggle]');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('is-menu-open');
        toggle.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
      // close menu when clicking a link on mobile
      nav.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('is-menu-open');
          toggle.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  /* ---- Scroll reveal ---- */
  const revealTargets = document.querySelectorAll('.reveal');
  if (revealTargets.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-in'));
  }

  /* ---- Mood check-in ---- */
  const moodGrid = document.querySelector('[data-mood]');
  if (moodGrid) {
    const response = document.querySelector('[data-mood-response]');
    const responseTitle = response?.querySelector('[data-mood-title]');
    const responseBody = response?.querySelector('[data-mood-body]');
    const responseMeta = response?.querySelector('[data-mood-meta]');

    const messages = {
      overwhelmed: {
        title: 'Feeling overwhelmed doesn\u2019t mean you\u2019re weak.',
        body: 'It often means you\u2019ve been carrying too much, for too long, and doing it quietly. Set the load down, just for now. It will still be there when you\u2019re ready to pick it back up \u2014 and you don\u2019t have to lift it alone.',
        meta: 'A gentle nudge \u00b7 not a diagnosis'
      },
      lonely: {
        title: 'Feeling lonely doesn\u2019t mean you\u2019re alone.',
        body: 'Loneliness is what shows up when we want to be known and haven\u2019t been, lately. It\u2019s a signal, not a verdict. A Support Circle is one place to be met without having to explain everything.',
        meta: 'A gentle nudge \u00b7 not a diagnosis'
      },
      stressed: {
        title: 'Stress is your mind asking for care.',
        body: 'It\u2019s okay to pause. It\u2019s okay to do less today than you did yesterday. Rest isn\u2019t the reward at the end \u2014 it\u2019s part of how the work gets done.',
        meta: 'A gentle nudge \u00b7 not a diagnosis'
      },
      confused: {
        title: 'Confusion is part of growth.',
        body: 'You don\u2019t have to have every answer today. The people you admire didn\u2019t either. Being unsure is often the honest place from which real clarity starts.',
        meta: 'A gentle nudge \u00b7 not a diagnosis'
      },
      okay: {
        title: 'Feeling okay is worth appreciating.',
        body: 'Not every day has to be a peak. \u201cOkay\u201d is a soft, sturdy word. Be gentle with yourself here \u2014 rest inside the calm, and don\u2019t rush to make it into something bigger.',
        meta: 'A gentle nudge \u00b7 not a diagnosis'
      },
      hopeful: {
        title: 'Hope is a quiet kind of courage.',
        body: 'Hold on to this feeling gently. You don\u2019t have to justify it or defend it. Just let it stay for a while, and let it move you toward whatever\u2019s next.',
        meta: 'A gentle nudge \u00b7 not a diagnosis'
      }
    };

    moodGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.mood__btn');
      if (!btn) return;
      const mood = btn.dataset.mood;
      const msg = messages[mood];
      if (!msg || !response) return;

      moodGrid.querySelectorAll('.mood__btn').forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      // Fade content, swap, open
      response.classList.remove('is-open');
      // Force reflow to restart transition
      void response.offsetWidth;

      requestAnimationFrame(() => {
        if (responseTitle) responseTitle.textContent = msg.title;
        if (responseBody)  responseBody.textContent  = msg.body;
        if (responseMeta)  responseMeta.textContent  = msg.meta;
        response.classList.add('is-open');
      });
    });
  }

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const runCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString('en-US');
        if (suffix) {
          const s = document.createElement('span');
          s.className = 'suffix';
          s.textContent = suffix;
          el.appendChild(s);
        }
        return;
      }
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const v = Math.round(target * easeOut(p));
        el.textContent = v.toLocaleString('en-US');
        if (suffix && p === 1) {
          const s = document.createElement('span');
          s.className = 'suffix';
          s.textContent = suffix;
          el.appendChild(s);
        }
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          runCount(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => io.observe(c));
  }

  /* ---- Hero ambient particles (seeds) ---- */
  const seedField = document.querySelector('[data-seeds]');
  if (seedField && !prefersReducedMotion) {
    const count = 14;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement('span');
      s.className = 'seed';
      const size = 3 + Math.random() * 5;
      s.style.width = s.style.height = `${size}px`;
      s.style.left = `${Math.random() * 100}%`;
      s.style.bottom = `-${Math.random() * 20}%`;
      s.style.animationDuration = `${18 + Math.random() * 16}s`;
      s.style.animationDelay = `${-Math.random() * 20}s`;
      s.style.opacity = String(0.25 + Math.random() * 0.4);
      s.style.background = i % 3 === 0
        ? 'var(--blush)'
        : (i % 3 === 1 ? 'var(--marigold)' : 'var(--forest-soft)');
      frag.appendChild(s);
    }
    seedField.appendChild(frag);
  }

  /* ---- Hero mouse parallax on blobs ---- */
  const heroAmbient = document.querySelector('[data-ambient]');
  if (heroAmbient && !prefersReducedMotion && window.matchMedia('(hover:hover)').matches) {
    const blobs = heroAmbient.querySelectorAll('.blob');
    let raf = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    heroAmbient.parentElement.addEventListener('mousemove', (e) => {
      const rect = heroAmbient.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width  - 0.5) * 20;
      ty = ((e.clientY - rect.top)  / rect.height - 0.5) * 20;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      blobs.forEach((b, i) => {
        const k = (i + 1) * 0.6;
        b.style.transform = `translate(${cx * k}px, ${cy * k}px)`;
      });
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    };
  }

  /* ---- Chip filter (stories / resources) ---- */
  document.querySelectorAll('[data-filter]').forEach(group => {
    const items = document.querySelectorAll(`[data-filter-target="${group.dataset.filter}"] > *`);
    group.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      group.querySelectorAll('.chip').forEach(c => c.classList.remove('is-on'));
      chip.classList.add('is-on');
      const val = chip.dataset.val;
      items.forEach(item => {
        const match = val === 'all' || item.dataset.cat === val;
        item.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---- Year in footer ---- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
})();
