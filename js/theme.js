/* ==========================================================================
   Theme — Dark / Light Mode Toggle & Persistence
   Checks localStorage, falls back to prefers-color-scheme, toggles
   data-theme attribute on <html>, and saves preference.
   ========================================================================== */

const STORAGE_KEY = 'theme';
const DARK = 'dark';
const LIGHT = 'light';

/**
 * Determine the initial theme.
 * Priority: localStorage → prefers-color-scheme → light (default).
 * @returns {'dark'|'light'}
 */
function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === DARK || stored === LIGHT) {
    return stored;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DARK;
  }

  return LIGHT;
}

/**
 * Apply the given theme to the document.
 * Updates aria-label on the toggle button to reflect current state.
 * @param {'dark'|'light'} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  // Update toggle button aria-label to reflect what clicking will do
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-label',
      theme === DARK ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }
}

/**
 * Toggle between dark and light themes.
 * Saves the new preference to localStorage.
 */
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === DARK ? LIGHT : DARK;
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
}

/**
 * Initialize the theme system.
 * Sets the initial theme and wires up the toggle button.
 */
export function initTheme() {
  // Apply initial theme immediately
  const theme = getInitialTheme();
  applyTheme(theme);

  // Bind toggle button
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.add('nav__theme-toggle--spin');
      toggleTheme();

      // Remove spin class after animation completes
      toggleBtn.addEventListener('animationend', () => {
        toggleBtn.classList.remove('nav__theme-toggle--spin');
      }, { once: true });
    });
  }

  // Listen for system preference changes (when no stored preference)
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only follow system preference if user hasn't manually chosen
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });
  }
}
