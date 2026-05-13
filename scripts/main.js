// ====== Matrix Rain ======
const canvas = document.getElementById('matrix-rain');
const ctx    = canvas.getContext('2d');

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF';

let cols, drops;

/**
 * Initializes (or re-initializes) the rain grid.
 * Called once on load and again on every window resize to match new dimensions.
 */
function initRain() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const fontSize = 14;
  cols  = Math.floor(canvas.width / fontSize);
  drops = Array(cols).fill(1);
  ctx.font = `${fontSize}px monospace`;
}

function drawRain() {
  // Semi-transparent fill creates a fading trail behind each character
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Read from CSS variables so the rain color matches the active theme
  const style = getComputedStyle(document.documentElement);
  ctx.fillStyle = style.getPropertyValue('--green-bright').trim() || '#00ff41';

  drops.forEach((y, i) => {
    const char = CHARS[Math.floor(Math.random() * CHARS.length)];
    ctx.fillText(char, i * 14, y * 14);

    // Reset to top with randomness so all columns don't restart in sync
    if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  });
}

initRain();
window.addEventListener('resize', initRain);
setInterval(drawRain, 50);


// ====== Theme Switcher ======
const themes = ['', 'theme-amber', 'theme-cyan']; // '' = default green
let themeIndex = 0;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  themeIndex = themes.indexOf(savedTheme);
  if (themeIndex === -1) {
    // Stored value is no longer valid — clear it and fall back to default
    themeIndex = 0;
    localStorage.removeItem('theme');
  } else {
    document.body.classList.add(savedTheme);
  }
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
      // Back to default — remove the key rather than storing an empty string
      localStorage.removeItem('theme');
    }
  });
}


// ====== Typewriter Effect ======
// Types the hero subtitle character by character on page load.
// Returns a Promise that resolves when typing finishes.
function typewriter(el, speed = 38) {
  const fullHTML = el.innerHTML; // preserve original markup (e.g. <strong> tags)
  const plainText = el.textContent; // use plain text as the typing source
  el.textContent  = '';

  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  cursor.textContent = '_';
  el.appendChild(cursor);

  return new Promise(resolve => {
    let i = 0;

    /**
     * Recursively inserts one character per tick before the cursor element.
     * Once all characters are typed, restores the original HTML
     * (to preserve any inline tags stripped earlier) and resolves the Promise.
     */
    function tick() {
      if (i < plainText.length) {
        cursor.insertAdjacentText('beforebegin', plainText[i++]);
        setTimeout(tick, speed);
      } else {
        el.innerHTML = fullHTML;
        resolve();
      }
    }
    setTimeout(tick, 600); // initial delay before typing starts
  });
}

const subtextEl = document.getElementById('subtext');
if (subtextEl) typewriter(subtextEl);


// ====== Contact Form ======
function handleSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('msg').value.trim();

  console.log('[form] Submission:');
  console.table({ name, email, message });

  const popup = document.getElementById('form-popup');
  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 3000);

  e.target.reset();
}

// Guard: the contact form only exists on index.html
const contactForm = document.querySelector('.contact-form');
if (contactForm) contactForm.addEventListener('submit', handleSubmit);


// ====== Hamburger Navigation ======
const navToggle = document.getElementById('nav-toggle');
const mainNav   = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}
