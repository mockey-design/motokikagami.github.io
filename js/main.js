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
      link.setAttribute('aria-current', 'page');
    }
  });

  // Mobile menu
  const menuBtn = document.querySelector('.nav-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
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
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---- BibTeX copy ----
function copyBibtex(text) {
  if (!navigator.clipboard) {
    showToast('Please select and copy the displayed BibTeX.');
    return;
  }
  navigator.clipboard.writeText(text)
    .then(() => showToast('BibTeX copied!'))
    .catch(() => showToast('Please select and copy the displayed BibTeX.'));
}

// ---- Modal ----
let currentModal = null;
let modalTrigger = null;

function openModal(pub) {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  if (!overlay || !modal) return;

  modalTrigger = document.activeElement;
  modal.innerHTML = buildModalHTML(pub);
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.querySelector('.modal-copy')?.addEventListener('click', () => copyBibtex(pub.bibtex));
  modal.querySelector('.modal-toggle')?.addEventListener('click', event => toggleBibtex(event.currentTarget));
  overlay.hidden = false;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  currentModal = overlay;

  modal.querySelector('.modal-close').focus();
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.hidden = true;
  document.body.style.overflow = '';
  currentModal = null;
  modalTrigger?.focus();
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
         <button class="bibtex-copy-btn modal-copy">Copy</button>
         <button class="bibtex-copy-btn modal-toggle" aria-expanded="false" style="margin-left:4px">Show</button>
       </p>
       <pre class="bibtex-block" id="bibtex-${pub.id}">${escapeHtml(pub.bibtex)}</pre>`
    : '';

  return `
    <div class="modal-header">
      <p class="modal-venue">${pub.venue} · ${pub.year}</p>
      <h2 class="modal-title" id="modal-title">${pub.title}</h2>
      <button class="modal-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </button>
    </div>
    <div class="modal-body">
      <p class="modal-section-label">Authors</p>
      <p class="modal-abstract" style="font-style:italic">${authors}</p>
      ${pub.citation_details ? `<p class="modal-abstract">${pub.citation_details}</p>` : ''}
      ${pub.presentation ? `<p class="modal-abstract">${pub.presentation}</p>` : ''}
      <p class="modal-section-label" style="margin-top:1rem">Research summary</p>
      <p class="modal-abstract">${pub.abstract}</p>
      ${pub.my_role ? `<p class="modal-section-label">My role</p><p class="modal-abstract">${pub.my_role}</p>` : ''}
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
  btn.setAttribute('aria-expanded', String(block.classList.contains('visible')));
}

function buildLinkButtons(pub, modal = false) {
  const cls = modal ? 'modal-link' : 'card-link';
  return [['project', 'Project'], ['pdf', 'PDF'], ['doi', 'DOI'], ['video', 'Video']]
    .filter(([field]) => pub[field] && pub[field] !== '#')
    .map(([field, label]) => `<a href="${escapeHtml(pub[field])}" target="_blank" rel="noopener" class="${cls}">${label}</a>`)
    .join('');
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// Keyboard close
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && currentModal) closeModal();
  if (e.key === 'Tab' && currentModal) {
    const elements = [...currentModal.querySelectorAll('button, a[href]')];
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
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
