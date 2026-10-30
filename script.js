const projects = [
  {
    title: 'Atmos',
    category: 'Weather',
    description: 'Real-time weather forecast app. Search any city to see current conditions, humidity, wind, pressure and a 5-day forecast. The background changes with the weather and invalid cities show a clear error.',
    short: 'Real-time weather app with city search, 5-day forecast and dynamic weather backgrounds.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
    demo: 'https://adistamrat.github.io/weather-forecast/',
    code: 'https://github.com/adistamrat/weather-forecast'  
  },
  {
    title: 'Nova Store',
    category: 'E-commerce',
    description: 'E-commerce catalog and cart. Browse products from FakeStoreAPI, filter by category, sort, and use a slide-out cart with quantity controls, tax, shipping and a simulated checkout.',
    short: 'Modern store with product catalog, filters, slide-out cart and checkout simulation.',
    tags: ['HTML', 'CSS', 'JavaScript', 'FakeStoreAPI'],
    demo: 'https://adistamrat.github.io/shopping-store/',
    code: 'https://github.com/adistamrat/shopping-store'     
  }
];

// ===== HELPERS =====
const SIZES = { desktop: { w: 1280, h: 800 }, mobile: { w: 390, h: 780 } };

// Scale an iframe (rendered at a real screen size) to fit its container
function fitFrame(stage, frame, device) {
  const size = SIZES[device];
  const sw = stage.clientWidth;
  const sh = stage.clientHeight;
  const scale = device === 'desktop' ? sw / size.w : Math.min(sh / size.h, sw / size.w);
  const x = device === 'desktop' ? 0 : (sw - size.w * scale) / 2;
  const y = device === 'desktop' ? 0 : (sh - size.h * scale) / 2;
  frame.style.width = size.w + 'px';
  frame.style.height = size.h + 'px';
  frame.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

// ===== PROJECT CARDS =====
const grid = document.getElementById('projectGrid');

projects.forEach((p, i) => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <button class="thumb" type="button" data-open="${i}" aria-label="Open live preview of ${p.title}">
      <span class="badge">${p.category}</span>
      <iframe src="${p.demo}" title="" aria-hidden="true" tabindex="-1" loading="lazy"></iframe>
    </button>
    <h3>${p.title}</h3>
    <p>${p.short}</p>
    <ul class="tags">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
    <div class="card-actions">
      <button class="btn btn-outline btn-sm" type="button" data-open="${i}">Live preview</button>
      <a class="btn btn-outline btn-sm" href="${p.code}" target="_blank" rel="noopener" data-code>Code</a>
    </div>`;
  grid.appendChild(card);
});

// Keep the card thumbnails scaled to their width
function fitThumbs() {
  grid.querySelectorAll('.thumb').forEach((t) => {
    const frame = t.querySelector('iframe');
    frame.style.transform = `scale(${t.clientWidth / SIZES.desktop.w})`;
  });
}
fitThumbs();

// "Code" buttons do nothing until you replace '#' with a real link
grid.querySelectorAll('[data-code]').forEach((a) => {
  a.addEventListener('click', (e) => { if (a.getAttribute('href') === '#') e.preventDefault(); });
});

// ===== PROJECT MODAL =====
const modal = document.getElementById('projectModal');
const stage = document.getElementById('modalStage');
const frame = document.getElementById('modalFrame');
const toggleBtns = modal.querySelectorAll('[data-device]');
let device = 'desktop';

function setDevice(next) {
  device = next;
  toggleBtns.forEach((b) => {
    const active = b.dataset.device === next;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-pressed', String(active));
  });
  fitFrame(stage, frame, device);
}

function openProject(i) {
  const p = projects[i];
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalDesc').textContent = p.description;
  document.getElementById('modalOpen').href = p.demo;
  frame.title = p.title + ' live preview';
  frame.src = p.demo;
  modal.showModal();
  setDevice('desktop');
}

grid.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-open]');
  if (trigger) openProject(Number(trigger.dataset.open));
});
toggleBtns.forEach((b) => b.addEventListener('click', () => setDevice(b.dataset.device)));

function closeModal() { modal.close(); }
document.getElementById('modalClose').addEventListener('click', closeModal);
// Clicking the dark backdrop closes the popup
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
// Stop the app inside from running in the background after closing
modal.addEventListener('close', () => { frame.src = 'about:blank'; });

window.addEventListener('resize', () => {
  fitThumbs();
  if (modal.open) fitFrame(stage, frame, device);
});

// ===== THEME TOGGLE (dark / light) =====
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
  root.dataset.theme = theme;
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}
try {
  const saved = localStorage.getItem('theme');
  if (saved) applyTheme(saved);
} catch (err) { /* storage unavailable, keep default */ }

themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('theme', next); } catch (err) { /* ignore */ }
});

// ===== MOBILE MENU =====
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ===== ACTIVE NAV LINK ON SCROLL =====
const links = [...nav.querySelectorAll('a')];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
links.forEach((a) => {
  const section = document.querySelector(a.getAttribute('href'));
  if (section) observer.observe(section);
});

// ===== FOOTER YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();
