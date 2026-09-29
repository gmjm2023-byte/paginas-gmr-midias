const slides = [...document.querySelectorAll('.slide')];
const video = document.querySelector('video');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const pause = document.querySelector('#pause');
let current = 0, paused = reduced.matches, visible = true, timer;
video.muted = true;
video.defaultMuted = true;
function render() {
  slides.forEach((slide, index) => { slide.hidden = index !== current; });
  document.querySelector('#count').textContent = `0${current + 1} / 03`;
  if (current === 1 && !paused && visible && !document.hidden) { video.muted = true; video.play().catch(() => {}); } else video.pause();
  pause.textContent = paused ? '▶' : 'Ⅱ';
  pause.setAttribute('aria-label', paused ? 'Reproduzir carrossel' : 'Pausar carrossel');
  clearTimeout(timer);
  if (!paused && visible && !document.hidden) timer = setTimeout(() => change(1), current === 1 ? 14000 : 5500);
}
function change(direction) { current = (current + direction + slides.length) % slides.length; render(); }
document.querySelector('#prev').addEventListener('click', () => change(-1));
document.querySelector('#next').addEventListener('click', () => change(1));
pause.addEventListener('click', () => { paused = !paused; render(); });
document.addEventListener('visibilitychange', render);
reduced.addEventListener('change', () => { paused = reduced.matches; render(); });
new IntersectionObserver(entries => { visible = entries[0].isIntersecting; render(); }, {threshold:.15}).observe(document.querySelector('.showcase'));
render();
