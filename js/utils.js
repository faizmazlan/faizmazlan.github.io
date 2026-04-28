/* ==========================================================================
   Utilities — Shared helper functions
   Animated number counter, debounce, throttle, etc.
   ========================================================================== */

/**
 * Check if the user prefers reduced motion.
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* --------------------------------------------------------------------------
   Animated Number Counter
   Counts from 0 to a target number over ~2 seconds using requestAnimationFrame.
   Triggered when the element enters the viewport via IntersectionObserver.
   -------------------------------------------------------------------------- */

/**
 * Animate a single number element from 0 to its data-count-to value.
 * @param {HTMLElement} el — Element with data-count-to attribute
 * @param {number} duration — Animation duration in ms (default 2000)
 */
function animateNumber(el, duration = 2000) {
  const target = parseInt(el.getAttribute('data-count-to'), 10);
  if (isNaN(target)) return;

  // If reduced motion, set final value immediately
  if (prefersReducedMotion()) {
    el.textContent = target;
    return;
  }

  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic for a smooth deceleration
    const eased = 1 - Math.pow(1 - progress, 3);

    el.textContent = Math.round(eased * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/**
 * Initialize the number counter system.
 * Uses IntersectionObserver to trigger counting when stats enter viewport.
 */
export function initCounters() {
  const counterElements = document.querySelectorAll('[data-count-to]');

  if (counterElements.length === 0) return;

  // If reduced motion, set all values immediately
  if (prefersReducedMotion()) {
    counterElements.forEach((el) => {
      el.textContent = el.getAttribute('data-count-to');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.5,
      rootMargin: '0px',
    }
  );

  counterElements.forEach((el) => observer.observe(el));
}
