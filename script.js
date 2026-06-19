/* ═══════════════════════════════════════════════
   Plastics For Change — Interactions
═══════════════════════════════════════════════ */

// ── Nav scroll effect ──
const nav = document.getElementById('nav');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  backToTop.classList.toggle('visible', y > 500);
});

backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Mobile hamburger ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// ── Mobile dropdown accordions ──
document.querySelectorAll('.mobile-group__toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const items = toggle.nextElementSibling;
    const isOpen = items.classList.contains('open');

    // Close all
    document.querySelectorAll('.mobile-group__items').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.mobile-group__toggle').forEach(el => el.classList.remove('open'));

    if (!isOpen) {
      items.classList.add('open');
      toggle.classList.add('open');
    }
  });
});

// ── Animated stat counters ──
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ── Intersection Observer for scroll animations ──
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, parseInt(entry.target.dataset.target, 10));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
  // Fade-up animations
  [
    '.audience-card', '.step', '.product-card', '.cert-card',
    '.testimonial-card', '.story-card', '.resource-card',
    '.donate-tier', '.contact-benefit', '.section-title',
    '.section-sub', '.section-eyebrow', '.video-feature__text',
    '.video-feature__media', '.donate-content', '.contact-content'
  ].forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-up');
      const mod = i % 4;
      if (mod === 1) el.classList.add('fade-up-delay-1');
      if (mod === 2) el.classList.add('fade-up-delay-2');
      if (mod === 3) el.classList.add('fade-up-delay-3');
      fadeObserver.observe(el);
    });
  });

  // Counter animations
  document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));
});

// ── Donate amount selector ──
function selectAmount(btn, amount) {
  document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('amount-btn--active'));
  btn.classList.add('amount-btn--active');
  const input = document.getElementById('customAmount');
  if (input) input.value = '';
}

// ── Form submission (demo — replace with HubSpot embed) ──
function handleFormSubmit(e) {
  e.preventDefault();
  const box = e.target.closest('.contact-form-box');
  box.innerHTML = `
    <div class="form-success">
      <div class="form-success__icon">✓</div>
      <h3>Message received!</h3>
      <p>Thanks for reaching out. A member of our team will reply within one business day with material samples, pricing, and next steps.</p>
    </div>
  `;
}

// ── Why-scroll horizontal panels ──
(function() {
  const track = document.querySelector('.why-scroll__track');
  const dots = document.querySelectorAll('.why-scroll__dot');
  if (!track || !dots.length) return;

  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${index * 50}%)`;
    dots.forEach((d, i) => d.classList.toggle('why-scroll__dot--active', i === index));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.panel, 10));
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current === 0 ? 1 : 0), 6000);
    });
  });

  // Swipe support
  let startX = 0;
  const section = document.querySelector('.why-scroll');
  if (section) {
    section.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    section.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goTo(diff > 0 ? 1 : 0);
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current === 0 ? 1 : 0), 6000);
      }
    }, { passive: true });
  }

  // Auto-rotate every 5 seconds
  autoTimer = setInterval(() => goTo(current === 0 ? 1 : 0), 5000);
})();

// ── Testimonials carousel ──
(function() {
  const track = document.querySelector('.testimonials-carousel__track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimPrev');
  const nextBtn = document.getElementById('testimNext');
  const dotsContainer = document.getElementById('testimDots');
  if (!track || !slides.length || !dotsContainer) return;

  let current = 0;
  const total = slides.length;
  let autoTimer = null;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' carousel-dot--active' : '');
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = ((index % total) + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('carousel-dot--active', i === current)
    );
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  // Swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  }, { passive: true });

  autoTimer = setInterval(() => goTo(current + 1), 5000);
})();

// ── Awards carousel ──
(function() {
  const track = document.getElementById('awardsTrack');
  const viewport = document.querySelector('.awards-viewport');
  const prev = document.getElementById('awardsPrev');
  const next = document.getElementById('awardsNext');
  if (!track || !viewport || !prev || !next) return;

  const cards = track.querySelectorAll('.award-card');
  const total = cards.length;
  const gap = 16;
  let pos = 0;

  function getVisible() {
    const w = window.innerWidth;
    if (w <= 600) return 2;
    if (w <= 768) return 3;
    return 5;
  }

  function sizeCards() {
    const visible = getVisible();
    const vpWidth = viewport.offsetWidth;
    const cardW = (vpWidth - gap * (visible - 1)) / visible;
    cards.forEach(c => { c.style.width = cardW + 'px'; });
    return cardW;
  }

  function update() {
    const visible = getVisible();
    const cardW = sizeCards();
    const maxPos = Math.max(0, total - visible);
    pos = Math.min(pos, maxPos);
    track.style.transform = `translateX(-${pos * (cardW + gap)}px)`;
  }

  prev.addEventListener('click', () => { pos = Math.max(0, pos - 1); update(); });
  next.addEventListener('click', () => { const visible = getVisible(); pos = Math.min(total - visible, pos + 1); update(); });
  window.addEventListener('resize', update);
  update();
})();

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      mobileMenu.classList.remove('open');
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Active nav highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'rgba(255,255,255,1)'
          : 'rgba(255,255,255,0.7)';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));
