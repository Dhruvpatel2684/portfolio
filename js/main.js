// ========================================
// ANTIGRAVITY-STYLE PREMIUM INTERACTIONS
// Magnetic Cursor, Tilt Effects, Particles,
// Scroll Reveals, Text Scramble, Counters
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initMagneticButtons();
  initHoverTilt();
  initScrollReveal();
  initNavScroll();
  initSmoothScroll();
  initParticles();
  initCounters();
  initTextScramble();
});


// ========================================
// Preloader
// ========================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.style.overflow = 'auto';
      // Trigger hero animations after preloader
      triggerHeroAnimations();
    }, 1200);
  });
  // Fallback
  setTimeout(() => {
    preloader.classList.add('loaded');
    document.body.style.overflow = 'auto';
    triggerHeroAnimations();
  }, 3000);
}

function triggerHeroAnimations() {
  const reveals = document.querySelectorAll('.hero .reveal-up');
  reveals.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 200 + i * 150);
  });
}


// ========================================
// Custom Cursor with Smooth Follow
// ========================================
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  
  if (!dot || !outline) return;
  if (window.innerWidth < 768) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor animation loop
  function animateCursor() {
    // Dot follows quickly
    dotX += (mouseX - dotX) * 0.15;
    dotY += (mouseY - dotY) * 0.15;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';

    // Outline follows with more lag (smooth trail)
    outlineX += (mouseX - outlineX) * 0.08;
    outlineY += (mouseY - outlineY) * 0.08;
    outline.style.left = outlineX + 'px';
    outline.style.top = outlineY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states for interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .magnetic-btn, .glass-card, .tag, .skill-items span, .project-tech span'
  );

  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      dot.classList.add('hovering');
      outline.classList.add('hovering');
    });
    target.addEventListener('mouseleave', () => {
      dot.classList.remove('hovering');
      outline.classList.remove('hovering');
    });
  });

  // Click effect
  document.addEventListener('mousedown', () => dot.classList.add('clicking'));
  document.addEventListener('mouseup', () => dot.classList.remove('clicking'));
}


// ========================================
// Magnetic Button Effect (Antigravity-style)
// Elements attract toward cursor when nearby
// ========================================
function initMagneticButtons() {
  if (window.innerWidth < 768) return;

  const magneticElements = document.querySelectorAll('.magnetic-btn');

  magneticElements.forEach(el => {
    const strength = parseInt(el.dataset.strength) || 20;

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;

      el.style.transform = `translate(${deltaX * strength}px, ${deltaY * strength}px)`;
      el.style.transition = 'transform 0.2s ease-out';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

// ========================================
// 3D Hover Tilt Effect
// Cards tilt based on mouse position
// ========================================
function initHoverTilt() {
  if (window.innerWidth < 768) return;

  const tiltCards = document.querySelectorAll('.hover-tilt');

  tiltCards.forEach(card => {
    const maxTilt = parseInt(card.dataset.tiltMax) || 5;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (y - 0.5) * maxTilt * -1;
      const tiltY = (x - 0.5) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
      card.style.transition = 'transform 0.1s ease-out';

      // Move inner glow based on mouse
      const glowX = x * 100;
      const glowY = y * 100;
      card.style.background = `
        radial-gradient(circle at ${glowX}% ${glowY}%, rgba(99, 102, 241, 0.06), transparent 50%),
        rgba(17, 17, 24, 0.6)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.6s ease';
      card.style.background = 'rgba(17, 17, 24, 0.6)';
    });
  });
}


// ========================================
// Scroll Reveal Animations
// Elements animate in as they enter viewport
// ========================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal-up, .exp-card, .project-card, .skill-card, .edu-card, .certs-card, .about-paragraph, .detail-card'
  );

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        setTimeout(() => {
          entry.target.classList.add('visible');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    if (!el.closest('.hero')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    }
  });
}

// ========================================
// Navigation Scroll Effect
// ========================================
function initNavScroll() {
  const nav = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

// ========================================
// Smooth Scroll for Anchor Links
// ========================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}


// ========================================
// Floating Particles (Antigravity-style)
// Particles that float and repel from cursor
// ========================================
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const particleCount = 50;
  const particles = [];
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const size = Math.random() * 3 + 1;
    
    particle.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(139, 92, 246, 0.3)'};
      border-radius: 50%;
      pointer-events: none;
      transition: none;
    `;

    const data = {
      el: particle,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: size
    };

    particles.push(data);
    container.appendChild(particle);
  }

  // Track mouse
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animate particles
  function animateParticles() {
    particles.forEach(p => {
      // Move particles
      p.x += p.vx;
      p.y += p.vy;

      // Repel from cursor (antigravity effect)
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repelRadius = 150;

      if (dist < repelRadius) {
        const force = (repelRadius - dist) / repelRadius;
        p.vx += (dx / dist) * force * 0.5;
        p.vy += (dy / dist) * force * 0.5;
      }

      // Friction
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Boundaries with wrapping
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.y > window.innerHeight) p.y = 0;

      // Apply position
      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}


// ========================================
// Animated Counters
// Numbers count up when in view
// ========================================
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Ease out cubic
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(easeOut * target);
          
          counter.textContent = current;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

// ========================================
// Text Scramble Effect
// Characters shuffle before revealing text
// ========================================
function initTextScramble() {
  const scrambleElements = document.querySelectorAll('.scramble-text');
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  scrambleElements.forEach(el => {
    const originalText = el.textContent;
    let iteration = 0;
    let interval = null;

    const scrambleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Start scramble effect
          interval = setInterval(() => {
            el.textContent = originalText
              .split('')
              .map((char, index) => {
                if (index < iteration) return originalText[index];
                if (char === ' ') return ' ';
                return chars[Math.floor(Math.random() * chars.length)];
              })
              .join('');

            if (iteration >= originalText.length) {
              clearInterval(interval);
            }
            iteration += 1 / 2;
          }, 30);

          scrambleObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    scrambleObserver.observe(el);
  });
}


// ========================================
// Parallax on Scroll (subtle)
// ========================================
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  
  // Parallax for hero grid
  const grid = document.querySelector('.hero-grid-lines');
  if (grid) {
    grid.style.transform = `translateY(${scrolled * 0.3}px)`;
  }

  // Parallax for hero gradient
  const gradient = document.querySelector('.hero-bg-gradient');
  if (gradient) {
    gradient.style.transform = `translateY(${scrolled * 0.15}px)`;
  }
});

// ========================================
// Section Title Split Animation
// ========================================
function initSplitText() {
  const splitElements = document.querySelectorAll('.split-text');
  
  splitElements.forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';
    
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      span.style.transition = `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.03}s`;
      el.appendChild(span);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.querySelectorAll('span').forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(el);
  });
}

// Init split text after a short delay to ensure DOM is ready
setTimeout(initSplitText, 100);

// ========================================
// Floating animation for skill items
// Subtle hover wobble on skill tags
// ========================================
document.querySelectorAll('.skill-items span, .exp-tags .tag, .project-tech span').forEach(tag => {
  tag.addEventListener('mouseenter', function() {
    this.style.animation = 'tagFloat 0.5s ease forwards';
  });
  tag.addEventListener('animationend', function() {
    this.style.animation = '';
  });
});

// Add the keyframe dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes tagFloat {
    0% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ========================================
// Console Easter Egg
// ========================================
console.log(`
%c╔══════════════════════════════════════════╗
║  DHRUVKUMAR PATEL                        ║
║  AI Benchmark Engineer                   ║
║  ──────────────────────────────          ║
║  Built with ♥ and premium animations     ║
║  Antigravity-inspired interactions       ║
╚══════════════════════════════════════════╝
`, 'color: #6366f1; font-family: monospace; font-size: 11px;');
