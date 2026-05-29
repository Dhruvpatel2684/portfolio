gsap.registerPlugin(ScrollTrigger);

// =============================================
// ANTIGRAVITY EFFECT INITIALIZATION
// Uses Three.js AntigravityEffect from antigravity.js
// =============================================
let antigravityInstance = null;

function initAntigravity() {
  const container = document.getElementById('antigravity-container');
  if (!container) return;

  const theme = document.documentElement.getAttribute('data-theme') || 'light';
  const color = theme === 'dark' ? '#818cf8' : '#1a73e8';

  antigravityInstance = new AntigravityEffect(container, {
    count: 300,
    magnetRadius: 6,
    ringRadius: 7,
    waveSpeed: 0.4,
    waveAmplitude: 1,
    particleSize: 1.5,
    lerpSpeed: 0.05,
    color: color,
    autoAnimate: true,
    particleVariance: 1,
    rotationSpeed: 0.1,
    depthFactor: 1,
    pulseSpeed: 3,
    fieldStrength: 10,
  });
}

// =============================================
// SPLIT HERO NAME INTO CHARS
// =============================================
function splitName() {
  const el = document.getElementById('hero-name');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  text.split('').forEach(ch => {
    const s = document.createElement('span');
    s.className = 'char';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(s);
  });
}

// =============================================
// TITLE HOVER — letters scatter from cursor
// =============================================
function initNameHover() {
  const el = document.getElementById('hero-name');
  if (!el) return;
  el.addEventListener('mousemove', e => {
    el.querySelectorAll('.char').forEach(ch => {
      const r = ch.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = cx - e.clientX;
      const dy = cy - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const f = (80 - dist) / 80;
        ch.style.transform = `translate(${dx/dist*f*12}px,${dy/dist*f*9}px)`;
        ch.style.transition = 'transform .1s ease-out';
      }
    });
  });
  el.addEventListener('mouseleave', () => {
    el.querySelectorAll('.char').forEach(ch => {
      ch.style.transform = '';
      ch.style.transition = 'transform .45s cubic-bezier(.4,0,.2,1)';
    });
  });
}

// =============================================
// THEME TOGGLE
// =============================================
function initTheme() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const saved = localStorage.getItem('dp-theme');
  if (saved) { document.documentElement.setAttribute('data-theme', saved); icon(btn, saved); }
  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dp-theme', next);
    icon(btn, next);
    // Update antigravity particle color on theme change
    if (antigravityInstance) {
      const newColor = next === 'dark' ? '#818cf8' : '#1a73e8';
      antigravityInstance.setColor(newColor);
    }
  });
}
function icon(b, t) { b.innerHTML = t === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>'; }

// =============================================
// GSAP HERO ENTRANCE
// =============================================
function animateHero() {
  gsap.set('.hero-label', { opacity: 0, y: 12 });
  gsap.set('#hero-name .char', { opacity: 0, y: 18 });
  gsap.set('.hero-sub', { opacity: 0, y: 12 });
  gsap.set('.hero-actions', { opacity: 0, y: 12 });

  const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } });
  tl.to('.hero-label', { opacity: 1, y: 0, duration: 0.6 })
    .to('#hero-name .char', { opacity: 1, y: 0, stagger: 0.025, duration: 0.45 }, '-=.3')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.6 }, '-=.2')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.6 }, '-=.3');
}

// =============================================
// SCROLL REVEALS
// =============================================
function initReveals() {
  gsap.utils.toArray('.exp-card,.skill-card,.project-card,.about-copy p,.about-sidebar,.edu-layout,.contact-title,.contact-links').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });
}

// =============================================
// NAV SCROLL
// =============================================
function initNav() {
  const h = document.getElementById('site-header');
  window.addEventListener('scroll', () => h.classList.toggle('scrolled', window.scrollY > 40));
}

// =============================================
// SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  splitName();
  initTheme();
  initNav();
  initNameHover();
  animateHero();
  initReveals();
  initAntigravity();
});
