// Mobile menu
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', false);
}));

// Countdown to the audition deadline
const deadline = new Date('2026-11-30T23:59:59');
const ids = ['d', 'h', 'm', 's'].map(id => document.getElementById(id));
function tick() {
  let diff = Math.max(0, deadline - new Date()) / 1000;
  const parts = [86400, 3600, 60, 1].map(n => {
    const v = Math.floor(diff / n);
    diff -= v * n;
    return String(v).padStart(2, '0');
  });
  ids.forEach((el, i) => (el.textContent = parts[i]));
}
tick();
setInterval(tick, 1000);

// Past stars: filter + pagination
const tabs = document.getElementById('tabs');
const pager = document.getElementById('pager');
const acts = [...document.querySelectorAll('.act')];
let filter = 'all';
let page = 1;
const perPage = () => (window.innerWidth >= 760 ? 3 : 2);

function render() {
  const list = acts.filter(a => filter === 'all' || a.dataset.c === filter);
  const pages = Math.max(1, Math.ceil(list.length / perPage()));
  page = Math.min(page, pages);
  const start = (page - 1) * perPage();
  acts.forEach(a => a.classList.add('hide'));
  list.slice(start, start + perPage()).forEach(a => a.classList.remove('hide'));

  pager.innerHTML = '';
  const mk = (label, p, opts = {}) => {
    const b = document.createElement('button');
    b.textContent = label;
    if (opts.aria) b.setAttribute('aria-label', opts.aria);
    if (opts.on) { b.className = 'on'; b.setAttribute('aria-current', 'page'); }
    b.disabled = !!opts.disabled;
    b.addEventListener('click', () => { page = p; render(); });
    pager.appendChild(b);
  };
  mk('‹', page - 1, { disabled: page === 1, aria: 'Previous page' });
  for (let i = 1; i <= pages; i++) mk(String(i), i, { on: i === page, aria: 'Page ' + i });
  mk('›', page + 1, { disabled: page === pages, aria: 'Next page' });
  pager.hidden = pages < 2;
}
tabs.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  tabs.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === btn));
  filter = btn.dataset.f;
  page = 1;
  render();
});
window.addEventListener('resize', render);
render();

// Audition form validation
const form = document.getElementById('form');
const msg = document.getElementById('msg');
form.addEventListener('submit', e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll('input,select').forEach(f => {
    const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle('bad', bad);
    if (bad) ok = false;
  });
  if (!ok) { msg.textContent = 'Please fill in every field correctly.'; return; }
  msg.textContent = 'Application sent. We will email you with your audition date.';
  form.reset();
});

// Hero banner carousel
const slides = [...document.querySelectorAll('.slide')];
const dots = document.getElementById('dots');
let cur = 0, timer;
slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', 'Show banner ' + (i + 1));
  b.addEventListener('click', () => { show(i); restart(); });
  dots.appendChild(b);
});
function show(i) {
  cur = (i + slides.length) % slides.length;
  slides.forEach((s, k) => s.classList.toggle('on', k === cur));
  [...dots.children].forEach((d, k) => d.classList.toggle('on', k === cur));
}
function restart() {
  clearInterval(timer);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => show(cur + 1), 5000);
}
document.getElementById('prev').addEventListener('click', () => { show(cur - 1); restart(); });
document.getElementById('next').addEventListener('click', () => { show(cur + 1); restart(); });
show(0);
restart();
