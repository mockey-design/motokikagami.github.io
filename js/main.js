/* ===================================================
   RESEARCHER PORTFOLIO — MAIN JS
   =================================================== */

// ---- Parallax (Hero) ----
(function initParallax() {
  const heroText = document.querySelector('.hero-text');
  const heroVisual = document.querySelector('.hero-visual');
  if (!heroText || !heroVisual) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const textY = y * 0.04;   // very subtle
        const visY = y * -0.04;   // slight opposite
        heroText.style.transform = `translateY(${textY}px)`;
        heroVisual.style.transform = `translateY(${Math.max(-4, Math.min(4, visY))}px)`;
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ---- Nav active state ----
(function initNav() {
  const links = document.querySelectorAll('.nav-links a');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile menu
  const menuBtn = document.querySelector('.nav-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }
})();

// ---- Fade-in observer ----
(function initFadeIn() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.05}s`;
    obs.observe(el);
  });
})();

// ---- Toast ----
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---- BibTeX copy ----
function copyBibtex(text) {
  navigator.clipboard.writeText(text).then(() => showToast('BibTeX copied!'));
}

// ---- Modal ----
let currentModal = null;

function openModal(pub) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  if (!overlay || !modal) return;

  modal.innerHTML = buildModalHTML(pub);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  currentModal = overlay;

  // Trap focus
  setTimeout(() => {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }, 50);
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  currentModal = null;
}

function buildModalHTML(pub) {
  const authors = pub.authors.map(a =>
    a === SITE_CONFIG.name ? `<strong>${a}</strong>` : a
  ).join(', ');

  const contribs = pub.contributions && pub.contributions.length > 0
    ? `<p class="modal-section-label">Contributions</p>
       <ul class="modal-bullets">
         ${pub.contributions.map(c => `<li>${c}</li>`).join('')}
       </ul>` : '';

  const results = pub.results && pub.results.length > 0
    ? `<p class="modal-section-label">Key Results</p>
       <ul class="modal-bullets">
         ${pub.results.map(r => `<li>${r}</li>`).join('')}
       </ul>` : '';

  const links = buildLinkButtons(pub, true);
  const bibtexSection = pub.bibtex
    ? `<p class="modal-section-label">BibTeX
         <button class="bibtex-copy-btn" onclick="copyBibtex(${JSON.stringify(pub.bibtex)})">Copy</button>
         <button class="bibtex-copy-btn" onclick="toggleBibtex(this)" style="margin-left:4px">Show</button>
       </p>
       <pre class="bibtex-block" id="bibtex-${pub.id}">${escapeHtml(pub.bibtex)}</pre>`
    : '';

  return `
    <div class="modal-header">
      <p class="modal-venue">${pub.venue} · ${pub.year}</p>
      <h2 class="modal-title">${pub.title}</h2>
      <button class="modal-close" onclick="closeModal()" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </button>
    </div>
    <div class="modal-body">
      <p class="modal-section-label">Authors</p>
      <p class="modal-abstract" style="font-style:italic">${authors}</p>
      <p class="modal-section-label" style="margin-top:1rem">Abstract</p>
      <p class="modal-abstract">${pub.abstract}</p>
      ${contribs}
      ${results}
      ${bibtexSection}
      <div class="modal-links">${links}</div>
    </div>
  `;
}

function toggleBibtex(btn) {
  const block = btn.closest('.modal-body').querySelector('.bibtex-block');
  if (!block) return;
  block.classList.toggle('visible');
  btn.textContent = block.classList.contains('visible') ? 'Hide' : 'Show';
}

function buildLinkButtons(pub, modal = false) {
  const cls = modal ? 'modal-link' : 'card-link';
  let html = '';
  if (pub.pdf && pub.pdf !== '#') {
    html += `<a href="${pub.pdf}" target="_blank" class="${cls} primary">PDF</a>`;
  } else if (pub.pdf === '#') {
    html += `<span class="${cls} primary" style="opacity:0.5;cursor:default">PDF</span>`;
  }
  if (pub.doi) {
    html += `<a href="${pub.doi}" target="_blank" class="${cls}">DOI</a>`;
  }
  if (pub.bibtex && !modal) {
    html += `<button class="${cls}" onclick="handleBibtexCard(event,${JSON.stringify(pub.id)})">BibTeX</button>`;
  }
  return html;
}

function handleBibtexCard(e, pubId) {
  e.stopPropagation();
  const pub = window.PUBLICATIONS.find(p => p.id === pubId);
  if (pub) copyBibtex(pub.bibtex);
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Keyboard close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && currentModal) closeModal();
});

// Click outside
document.addEventListener('click', e => {
  if (currentModal && e.target === currentModal) closeModal();
});

// ---- Stagger delay utility ----
function applyStagger(selector, base = 0.08) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${i * base}s`;
  });
}
