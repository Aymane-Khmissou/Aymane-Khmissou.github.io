const $ = (s) => document.querySelectorAll(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Année du footer
document.getElementById('year').textContent = new Date().getFullYear();

// Barre de progression du scroll
const prog = document.getElementById('prog');
addEventListener('scroll', () => {
  const h = document.documentElement;
  prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
}, { passive: true });

// Texte animé dans le hero
const words = ['réseaux Cisco et VLAN', 'virtualisation VMware ESXi', 'systèmes Windows et Linux', 'vidéosurveillance et câblage', 'applications web Flask', 'maintenance matérielle'];
const typed = document.getElementById('typed');
let w = 0, c = 0, del = false;
function tick() {
  const t = words[w];
  typed.textContent = t.slice(0, c);
  if (!del && c === t.length) { del = true; return setTimeout(tick, 1600); }
  if (del && c === 0) { del = false; w = (w + 1) % words.length; }
  c += del ? -1 : 1;
  setTimeout(tick, del ? 35 : 70);
}
if (reduce) { typed.textContent = words[0]; } else { tick(); }

// Compteurs
$('.stats b').forEach((b) => {
  const to = +b.dataset.to;
  if (reduce) { b.textContent = to; return; }
  let n = 0;
  const t = setInterval(() => { b.textContent = ++n; if (n >= to) clearInterval(t); }, 220);
});

// Apparition au scroll
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  io.unobserve(e.target);
}), { threshold: 0.12 });
$('.job, .card').forEach((n) => { n.classList.add('rv'); io.observe(n); });

// Lien actif dans le menu
const links = $('.bar nav a');
const nav = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-40% 0px -55% 0px' });
$('main section[id]').forEach((s) => nav.observe(s));

// Inclinaison de la photo selon la souris
const vis = document.querySelector('.visual');
if (matchMedia('(hover: hover)').matches && !reduce) {
  vis.addEventListener('mousemove', (e) => {
    const r = vis.getBoundingClientRect();
    vis.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 18 + 'deg');
    vis.style.setProperty('--rx', (0.5 - (e.clientY - r.top) / r.height) * 18 + 'deg');
  });
  vis.addEventListener('mouseleave', () => {
    vis.style.setProperty('--ry', '0deg');
    vis.style.setProperty('--rx', '0deg');
  });
}
