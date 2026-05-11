// ====== Matrix Rain ======
// Renders falling katakana and hex characters on a fullscreen canvas element
// positioned behind the UI, creating the Matrix-style background effect.

const canvas = document.getElementById('matrix-rain');
const ctx    = canvas.getContext('2d');

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';

let cols, drops;

/**
 * Initialises (or re-initialises) the rain grid.
 * Called once on load and again on every window resize to match new dimensions.
 */
function initRain() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const fontSize = 14;
  cols  = Math.floor(canvas.width / fontSize);
  drops = Array(cols).fill(1); // each entry is the current Y position of one column
  ctx.font = `${fontSize}px monospace`;
  console.log('[matrix] Rain initialized – cols:', cols);
}

/**
 * Draws one frame of the rain animation.
 * Called repeatedly by setInterval.
 */
function drawRain() {
  // Semi-transparent overlay creates the fading trail behind each character
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Read the active theme color from CSS variables so rain matches the theme
  const style = getComputedStyle(document.documentElement);
  ctx.fillStyle = style.getPropertyValue('--green-bright').trim() || '#00ff41';

  drops.forEach((y, i) => {
    const char = CHARS[Math.floor(Math.random() * CHARS.length)];
    ctx.fillText(char, i * 14, y * 14);

    // Once a drop passes the bottom, reset it to the top with some randomness
    // so columns don't all restart at the same time
    if (y * 14 > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  });
}

initRain();
window.addEventListener('resize', () => {
  initRain();
  console.log('[matrix] Reinitialized on resize');
});
setInterval(drawRain, 50);


// ====== Theme Switcher ======
// Cycles through three color themes by toggling a CSS class on <body>.
// The active theme is saved to localStorage to persist across page navigation.

const themes = ['', 'theme-amber', 'theme-cyan']; // '' = default green
let themeIndex = 0;

// Restore the previously selected theme on page load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  themeIndex = themes.indexOf(savedTheme);
  if (themeIndex === -1) themeIndex = 0; // reset if stored value is unrecognised
  document.body.classList.add(savedTheme);
}

const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.remove(...themes.filter(Boolean));
    themeIndex = (themeIndex + 1) % themes.length;

    if (themes[themeIndex]) {
      document.body.classList.add(themes[themeIndex]);
      localStorage.setItem('theme', themes[themeIndex]);
    } else {
      // Returned to default — remove the key rather than storing an empty string
      localStorage.removeItem('theme');
    }
    console.log('[theme] Switched to:', themes[themeIndex] || 'default (green)');
  });
}


// ====== Contact Form ======
// Intercepts form submission, logs the entered values, shows a success popup, then resets the form.
//
// Handles the contact form submit event.
function handleSubmit(e) {
  e.preventDefault(); // prevent the default form submission

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('msg').value.trim();

  console.log('[form] Submission received:');
  console.log('  name:   ', name);
  console.log('  email:  ', email);
  console.log('  message:', message);

  // Show the success popup, then hide it after 3 seconds
  const popup = document.getElementById('form-popup');
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 3000);

  e.target.reset();
}

// Guard: the form only exists on index.html, not on every page
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', handleSubmit);
  console.log('[form] Contact form listener attached');
}


// ====== Hamburger Navigation ======
// On mobile, the nav links are hidden and toggled via a three-line button.
// Clicking the button also updates aria-expanded for screen reader accessibility.

const navToggle = document.getElementById('nav-toggle');
const mainNav   = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    console.log('[nav] Menu', isOpen ? 'opened' : 'closed');
  });
}
