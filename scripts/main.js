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

  // Use current theme color
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

// On page load, restore saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  themeIndex = themes.indexOf(savedTheme);
  if (themeIndex === -1) themeIndex = 0; // fallback if value is corrupted
  document.body.classList.add(savedTheme);
}

const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    // Remove current theme class
    document.body.classList.remove(...themes.filter(Boolean));
    themeIndex = (themeIndex + 1) % themes.length;
    if (themes[themeIndex]) {
      document.body.classList.add(themes[themeIndex]);
      localStorage.setItem('theme', themes[themeIndex]);
    } else {
      localStorage.removeItem('theme'); // back to default, clear storage
    }
    console.log('[theme] Switched to:', themes[themeIndex] || 'default (green)');
  });
}

// Form Handler
function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('msg').value.trim();

  console.log('[form] Submission received:');
  console.log('  name:   ', name);
  console.log('  email:  ', email);
  console.log('  message:', message);

  const popup = document.getElementById('form-popup');
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 3000);
  e.target.reset();
}

const contactForm = document.querySelector('.contact-form');
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
