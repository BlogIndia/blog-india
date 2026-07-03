// ===== Paywall: 1 free article, then locked =====
(function articlePaywall() {
  const articleEl = document.querySelector('.article-wrap');
  if (!articleEl) return; // only applies to post pages

  const slug = location.pathname.split('/').pop();
  let read = [];
  try { read = JSON.parse(localStorage.getItem('bi_read_articles') || '[]'); } catch (e) { read = []; }

  if (read.includes(slug)) return; // already unlocked this one this browser

  if (read.length === 0) {
    read.push(slug);
    localStorage.setItem('bi_read_articles', JSON.stringify(read));
    return; // first free article — let it through
  }

  document.body.classList.add('paywalled');
  const overlay = document.createElement('div');
  overlay.className = 'paywall-overlay';
  overlay.innerHTML =
    '<div class="paywall-card">' +
      '<div class="paywall-icon">🔒</div>' +
      '<h3>You\'ve read your free story</h3>' +
      '<p>Subscribe to Blog India for unlimited access to every story on India, health, and geopolitics.</p>' +
      '<a href="https://rzp.io/rzp/pjFsVCZw" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Subscribe to Keep Reading</a>' +
      '<a href="../blog.html" class="paywall-back">← Back to all stories</a>' +
    '</div>';
  document.body.appendChild(overlay);
})();

// ===== 60-second subscribe nudge (site-wide) =====
(function subscribeNudge() {
  if (sessionStorage.getItem('bi_nudge_shown')) return;
  setTimeout(() => {
    if (sessionStorage.getItem('bi_nudge_shown') || document.querySelector('.paywall-overlay')) return;
    sessionStorage.setItem('bi_nudge_shown', '1');
    const nudge = document.createElement('div');
    nudge.className = 'nudge-popup';
    nudge.innerHTML =
      '<button class="nudge-close" aria-label="Close">&times;</button>' +
      '<p class="nudge-title">👋 Enjoying Blog India?</p>' +
      '<p class="nudge-text">Subscribe to support independent journalism on India, health, and geopolitics.</p>' +
      '<a href="https://rzp.io/rzp/pjFsVCZw" target="_blank" rel="noopener noreferrer" class="btn btn-primary nudge-btn">Subscribe Now</a>';
    document.body.appendChild(nudge);
    nudge.querySelector('.nudge-close').addEventListener('click', () => nudge.remove());
  }, 60000);
})();

// ===== Theme toggle =====
(function initTheme() {
  const saved = localStorage.getItem('bi-theme');
  const theme = saved || 'light';
  document.documentElement.setAttribute('data-theme', theme);
  document.body && document.body.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {
  const root = document.body;
  root.setAttribute('data-theme', localStorage.getItem('bi-theme') || 'light');

  const themeBtn = document.querySelector('.theme-toggle');
  const updateIcon = () => {
    const t = root.getAttribute('data-theme');
    if (themeBtn) themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  };
  updateIcon();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('bi-theme', next);
      updateIcon();
    });
  }

  // ===== Mobile nav =====
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });
  }

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  // ===== Back to top =====
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 500);
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ===== Blog filter =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const postCards = document.querySelectorAll('[data-category]');
  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        postCards.forEach((card) => {
          const show = cat === 'all' || card.dataset.category === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // ===== Newsletter fake-submit =====
  document.querySelectorAll('.nl-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.parentElement.querySelector('.nl-msg');
      if (msg) {
        msg.style.display = 'block';
        msg.textContent = '✓ Thank you for subscribing! Check your inbox for a confirmation.';
        form.reset();
      }
    });
  });

  // ===== Contact form fake-submit =====
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.querySelector('.form-msg');
      if (msg) {
        msg.style.display = 'block';
        msg.textContent = '✓ Message sent! We\'ll get back to you within 2 business days.';
      }
      contactForm.reset();
    });
  }

  // ===== Footer year =====
  document.querySelectorAll('.year').forEach((el) => { el.textContent = new Date().getFullYear(); });
});
