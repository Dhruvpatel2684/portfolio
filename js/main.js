gsap.registerPlugin(ScrollTrigger);

// =============================================
// FLOATING DOT FIELD — Antigravity-style
// Dots spawn near cursor position across the
// ENTIRE page and drift away with physics
// =============================================
class DotField {
  constructor() {
    this.canvas = document.getElementById('dot-field');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.dots = [];
    this.mouse = { x: -999, y: -999 };
    this.maxDots = 120;
    this.spawnRate = 3;
    this.frame = 0;

    this.resize();
    this.listen();
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = document.documentElement.scrollHeight;
  }

  listen() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('scroll', () => {
      this.canvas.height = document.documentElement.scrollHeight;
    });
    document.addEventListener('mousemove', e => {
      this.mouse.x = e.pageX;
      this.mouse.y = e.pageY;
    });
    document.addEventListener('mouseleave', () => {
      this.mouse.x = -999;
      this.mouse.y = -999;
    });
  }

  spawn() {
    if (this.mouse.x < 0) return;
    for (let i = 0; i < this.spawnRate; i++) {
      if (this.dots.length >= this.maxDots) this.dots.shift();
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 30;
      this.dots.push({
        x: this.mouse.x + Math.cos(angle) * dist,
        y: this.mouse.y + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        r: Math.random() * 3 + 1.5,
        life: 1,
        decay: Math.random() * 0.008 + 0.004,
      });
    }
  }

  update() {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--dot').trim();

    for (let i = this.dots.length - 1; i >= 0; i--) {
      const d = this.dots[i];

      // Repel from cursor
      const dx = d.x - this.mouse.x;
      const dy = d.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist > 0) {
        const force = (100 - dist) / 100;
        d.vx += (dx / dist) * force * 0.8;
        d.vy += (dy / dist) * force * 0.8;
      }

      d.vx *= 0.97;
      d.vy *= 0.97;
      d.x += d.vx;
      d.y += d.vy;
      d.life -= d.decay;

      if (d.life <= 0) {
        this.dots.splice(i, 1);
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(d.x, d.y, d.r * d.life, 0, Math.PI * 2);
      this.ctx.fillStyle = color || 'rgba(26,115,232,0.5)';
      this.ctx.globalAlpha = d.life * 0.7;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.frame++;
    if (this.frame % 2 === 0) this.spawn();
    this.update();
    requestAnimationFrame(() => this.loop());
  }
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
  new DotField();
});
