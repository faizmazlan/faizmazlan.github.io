/* ==========================================================================
   App — Main Entry Point
   Imports and initializes all modules on DOMContentLoaded.
   ========================================================================== */

import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initCounters } from './utils.js';
import { initContact } from './contact.js';
import { initTheme } from './theme.js';
import { initCarousel } from './carousel.js';

/**
 * Initialize all application modules.
 */
function init() {
  initTheme();
  initNavigation();
  initAnimations();
  initCounters();
  initContact();
  initCarousel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
