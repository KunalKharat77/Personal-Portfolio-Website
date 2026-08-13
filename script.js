/* ═══════════════════════════════════════════════════════════════
   KUNAL KHARAT PORTFOLIO — SCRIPT.JS
   Vanilla JavaScript — No frameworks, no libraries.
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── UTILITIES ──────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];


/* ═══════════════════════════════════════════════════════════════
   1. NAVBAR — Scroll effect + Active section highlighting
═══════════════════════════════════════════════════════════════ */
(function initNavbar() {
  const navbar = $('#navbar');
  const navLinks = $$('.nav-link');
  const sections = $$('section[id]');

  if (!navbar) return;

  // Cache sections and their positions
  let sectionData = [];
  const cacheSections = () => {
    sectionData = sections.map(sec => ({
      id: sec.id,
      top: sec.offsetTop - 120,
      bottom: sec.offsetTop + sec.offsetHeight - 120,
    }));
  };

  // Throttle helper
  const throttle = (fn, ms) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= ms) { last = now; fn(...args); }
    };
  };

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // ── Toggle scrolled class ──
        navbar.classList.toggle('scrolled', scrollY > 60);

        // ── Scroll progress bar ──
        const prog = $('#scrollProgress');
        if (prog) {
          const docH = document.documentElement.scrollHeight - window.innerHeight;
          prog.style.width = (docH > 0 ? (scrollY / docH) * 100 : 0) + '%';
        }

        // ── Active nav link ──
        let current = '';
        sectionData.forEach(s => {
          if (scrollY >= s.top && scrollY < s.bottom) current = s.id;
        });

        navLinks.forEach(link => {
          const section = link.dataset.section;
          link.classList.toggle('active', section === current);
        });

        // ── Back-to-top button ──
        const btt = $('#backToTop');
        if (btt) btt.classList.toggle('visible', scrollY > 400);

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', throttle(cacheSections, 250));
  cacheSections();
  onScroll(); // run once on load
})();


/* ═══════════════════════════════════════════════════════════════
   2. MOBILE MENU — Hamburger toggle
═══════════════════════════════════════════════════════════════ */
(function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  const mobLinks = $$('.mob-link');

  if (!hamburger || !mobileMenu) return;

  const close = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const open = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? close() : open();
  });

  // Close on mobile link click
  mobLinks.forEach(link => link.addEventListener('click', close));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


/* ═══════════════════════════════════════════════════════════════
   3. SMOOTH SCROLLING — All anchor links
═══════════════════════════════════════════════════════════════ */
(function initSmoothScroll() {
  const NAV_OFFSET = 80;

  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    const top = target.offsetTop - NAV_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ═══════════════════════════════════════════════════════════════
   4. TYPING ANIMATION — Hero role text
═══════════════════════════════════════════════════════════════ */
(function initTypingEffect() {
  const el = $('#typingText');
  if (!el) return;

  const phrases = [
    'responsive web experiences.',
    'DSA-driven solutions.',
    'projects that solve problems.',
    'clean and scalable code.',
    'a stronger future, one project at a time.',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pause = false;

  const SPEED_TYPE = 65;
  const SPEED_DELETE = 35;
  const PAUSE_AFTER = 2000;
  const PAUSE_BEFORE = 400;

  const tick = () => {
    const phrase = phrases[phraseIdx];

    if (!isDeleting) {
      // Typing
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);

      if (charIdx === phrase.length) {
        // Pause, then start deleting
        if (pause) return;
        pause = true;
        setTimeout(() => {
          pause = false;
          isDeleting = true;
          tick();
        }, PAUSE_AFTER);
        return;
      }
    } else {
      // Deleting
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);

      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(tick, isDeleting ? SPEED_DELETE : SPEED_TYPE);
  };

  // Slight initial delay so page loads first
  setTimeout(tick, 800);
})();


/* ═══════════════════════════════════════════════════════════════
   5. SCROLL REVEAL — Fade/slide-in on scroll
═══════════════════════════════════════════════════════════════ */
(function initScrollReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(item => observer.observe(item));
})();


/* ═══════════════════════════════════════════════════════════════
   6. SKILL BARS — Animate on scroll
═══════════════════════════════════════════════════════════════ */
(function initSkillBars() {
  const bars = $$('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const width = bar.dataset.width || '0';
          // Short delay to let the card reveal first
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
})();


/* ═══════════════════════════════════════════════════════════════
   7. ANIMATED COUNTERS — Hero stats + Achievements
═══════════════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = $$('[data-target]');
  if (!counters.length) return;

  const DURATION = 1800; // ms

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const value = Math.round(easeOutCubic(progress) * target);
      el.textContent = value;

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach(c => observer.observe(c));
})();


/* ═══════════════════════════════════════════════════════════════
   8. PARTICLE CANVAS — Hero floating particles
═══════════════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Respect reduced-motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) { canvas.style.display = 'none'; return; }

  let W, H, particles, raf;

  const PARTICLE_COUNT = 55;
  const COLORS = ['rgba(0,212,255,', 'rgba(168,85,247,', 'rgba(255,255,255,'];

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.alpha = Math.random() * 0.4 + 0.05;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 1;
      this.decay = Math.random() * 0.001 + 0.0003;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + (this.alpha * this.life) + ')';
      ctx.fill();
    }
  }

  const resize = () => {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };

  const init = () => {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  };

  const loop = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(loop);
  };

  // Pause when hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(loop);
  });

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });

  init();
  loop();
})();


/* ═══════════════════════════════════════════════════════════════
   9. RIPPLE EFFECT — Buttons
═══════════════════════════════════════════════════════════════ */
(function initRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.ripple');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const circle = document.createElement('span');
    circle.className = 'ripple-circle';
    circle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
    `;

    btn.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  });
})();


/* ═══════════════════════════════════════════════════════════════
   10. CONTACT FORM — Validation + Submission feedback
═══════════════════════════════════════════════════════════════ */
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const nameInput = $('#formName');
  const emailInput = $('#formEmail');
  const msgInput = $('#formMessage');
  const submitBtn = $('#submitBtn');
  const successEl = $('#formSuccess');

  const nameError = $('#nameError');
  const emailError = $('#emailError');
  const msgError = $('#msgError');

  // Field validators
  const validators = {
    name: v =>
      v.trim().length >= 2
        ? ''
        : 'Please enter your name (at least 2 characters).',

    email: v =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? ''
        : 'Please enter a valid email address.',

    msg: v =>
      v.trim().length >= 10
        ? ''
        : 'Please write a message (at least 10 characters).',
  };

  // Live validation on blur
  const validate = (input, errorEl, key) => {
    const err = validators[key](input.value);

    errorEl.textContent = err;
    input.parentElement.classList.toggle('error', !!err);

    return !err;
  };

  nameInput.addEventListener('blur', () =>
    validate(nameInput, nameError, 'name')
  );

  emailInput.addEventListener('blur', () =>
    validate(emailInput, emailError, 'email')
  );

  msgInput.addEventListener('blur', () =>
    validate(msgInput, msgError, 'msg')
  );

  // Clear error on input
  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener('input', () => {
      const errorEl = input.parentElement.querySelector('.field-error');

      if (errorEl) {
        errorEl.textContent = '';
      }

      input.parentElement.classList.remove('error');
    });
  });

  // Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const validName = validate(nameInput, nameError, 'name');
    const validEmail = validate(emailInput, emailError, 'email');
    const validMsg = validate(msgInput, msgError, 'msg');

    if (!validName || !validEmail || !validMsg) {
      if (!validName) {
        nameInput.focus();
      } else if (!validEmail) {
        emailInput.focus();
      } else {
        msgInput.focus();
      }

      return;
    }

    const btnText = submitBtn.querySelector('.btn-text');

    submitBtn.disabled = true;

    if (btnText) {
      btnText.textContent = 'Sending…';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        form.reset();

        submitBtn.disabled = false;

        if (btnText) {
          btnText.textContent = 'Send Message';
        }

        successEl.setAttribute('aria-hidden', 'false');

        setTimeout(() => {
          successEl.setAttribute('aria-hidden', 'true');
        }, 5000);

      } else {
        throw new Error('Form submission failed');
      }

    } catch (error) {
      console.error('Form submission error:', error);

      submitBtn.disabled = false;

      if (btnText) {
        btnText.textContent = 'Send Message';
      }

      alert(
        'Something went wrong. Please try again or contact me directly by email.'
      );
    }
  });
})();


/* ═══════════════════════════════════════════════════════════════
   11. BACK TO TOP BUTTON
═══════════════════════════════════════════════════════════════ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ═══════════════════════════════════════════════════════════════
   12. FOOTER YEAR
═══════════════════════════════════════════════════════════════ */
(function initYear() {
  const el = $('#year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ═══════════════════════════════════════════════════════════════
   13. CARD LIFT — Enhanced hover glow on project cards
═══════════════════════════════════════════════════════════════ */
(function initCardGlow() {
  const cards = $$('.project-card, .skill-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      card.style.transform = `translateY(-8px) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ═══════════════════════════════════════════════════════════════
   14. PERFORMANCE — Lazy-load non-hero images (future-proof)
═══════════════════════════════════════════════════════════════ */
(function initLazyImages() {
  const images = $$('img[loading="lazy"]');
  if (!('IntersectionObserver' in window) || !images.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  images.forEach(img => observer.observe(img));
})();


/* ═══════════════════════════════════════════════════════════════
   15. ACCESSIBILITY — Skip focus to hero on logo click
       + Keyboard navigation for mobile menu
═══════════════════════════════════════════════════════════════ */
(function initA11y() {
  // Trap focus in mobile menu when open
  const mobileMenu = $('#mobileMenu');
  const hamburger = $('#hamburger');
  if (!mobileMenu) return;

  mobileMenu.addEventListener('keydown', e => {
    if (!mobileMenu.classList.contains('open')) return;
    if (e.key !== 'Tab') return;

    const focusable = $$('a, button', mobileMenu).filter(
      el => !el.disabled && el.offsetParent !== null
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      hamburger.focus();
    }
  });
})();

/* ─── INIT LOG ────────────────────────────────────────────────── */
console.log(
  '%c KK Portfolio %c v1.0 — Built with ❤️ & Vanilla JS ',
  'background: linear-gradient(135deg, #00d4ff, #a855f7); color:#fff; font-weight:700; padding:4px 8px; border-radius:4px 0 0 4px;',
  'background:#111; color:#a0a0b8; padding:4px 8px; border-radius:0 4px 4px 0;'
);