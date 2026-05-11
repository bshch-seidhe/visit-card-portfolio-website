// Matrix rain
const canvas = document.getElementById('matrix-rain');
const ctx    = canvas.getContext('2d');

// Characters used in rain (katakana + digits)
const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';

let cols, drops;

function initRain() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const fontSize = 14;
  cols  = Math.floor(canvas.width / fontSize);
  drops = Array(cols).fill(1);
  ctx.font = `${fontSize}px monospace`;
  console.log("[matrix] Rain initialized – cols:", cols);
}

function drawRain() {
  // Slightly translucent black overlay that creates the fade trail
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Use current theme colour
  const style = getComputedStyle(document.documentElement);
  ctx.fillStyle = style.getPropertyValue('--green-bright').trim() || '#00ff41';

  drops.forEach((y, i) => {
    const char = CHARS[Math.floor(Math.random() * CHARS.length)];
    ctx.fillText(char, i * 14, y * 14);

    // Reset drop randomly after it passes screen height
    if (y * 14 > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  });
}

initRain();
window.addEventListener('resize', () => { initRain(); console.log("[matrix] Reinitialized on resize") });
setInterval(drawRain, 50);

// Theme switcher
const themes = ['', 'theme-amber', 'theme-cyan'];
let themeIndex = 0;

document.getElementById('theme-btn').addEventListener('click', () => {
  // Remove current theme class
  document.body.classList.remove(...themes.filter(Boolean));
  themeIndex = (themeIndex + 1) % themes.length;
  if (themes[themeIndex]) {
    document.body.classList.add(themes[themeIndex]);
  }
  console.log("[theme] Switched to: ", themes[themeIndex] || "default (green)");
});

// Form Handler
function handleSubmit(e) {
  e.preventDefault();
  console.log("[form] Message submitted by: ", e.target.name?.value);
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.textContent = './message_sent.sh ✓';
  btn.style.borderColor = 'var(--green-bright)';
  btn.style.boxShadow = '0 0 12px var(--green-glow)';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.borderColor = '';
    btn.style.boxShadow = '';
    e.target.reset();
  }, 2500);
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', handleSubmit);
  console.log("[form] Contact from listener attached");
}

// Hamburger menu
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    console.log('[nav] Menu', isOpen ? 'opened' : 'closed');
  });
}
