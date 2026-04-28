/* ==========================================================================
   Scroll Animation Module
   Single IntersectionObserver for data-animate elements,
   prefers-reduced-motion support, and parallax utility.
   ========================================================================== */

/**
 * Check if the user prefers reduced motion.
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* --------------------------------------------------------------------------
   Scroll-Triggered Animations via IntersectionObserver
   -------------------------------------------------------------------------- */

/**
 * Initialize scroll-triggered animations.
 * - Queries all elements with [data-animate]
 * - Adds .animate-hidden on init (unless reduced motion is preferred)
 * - Toggles to .animate-visible when element enters viewport
 * - Supports data-animate-delay for staggered reveals
 */
export function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length === 0) return;

  // If user prefers reduced motion, skip adding .animate-hidden
  // so all content is immediately visible — no observer needed.
  if (prefersReducedMotion()) {
    return;
  }

  // Set initial hidden state on all animated elements
  animatedElements.forEach((el) => {
    el.classList.add('animate-hidden');

    // Apply stagger delay via transition-delay if data-animate-delay is set
    const delay = el.getAttribute('data-animate-delay');
    if (delay) {
      el.style.transitionDelay = `${delay}ms`;
    }
  });

  // Single IntersectionObserver instance for all animated elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('animate-hidden');
          entry.target.classList.add('animate-visible');

          // Stop observing once animated (one-time reveal)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: '0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Parallax Utility — requestAnimationFrame-based scroll listener
   Elements with [data-parallax] get a subtle translateY based on scroll.
   Max offset: 50px. Throttled via rAF for 60fps.
   -------------------------------------------------------------------------- */

/**
 * Initialize parallax effect on elements with [data-parallax].
 * The data-parallax attribute value is the speed factor (default 0.3).
 * Positive values move the element slower than scroll (depth effect).
 */
export function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length === 0) return;

  // Skip parallax if user prefers reduced motion
  if (prefersReducedMotion()) {
    return;
  }

  let ticking = false;

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2 + scrollY;
      const viewportCenter = scrollY + window.innerHeight / 2;
      const distance = viewportCenter - elementCenter;

      // Calculate offset, clamped to ±50px max
      let offset = distance * speed * 0.1;
      offset = Math.max(-50, Math.min(50, offset));

      el.style.transform = `translateY(${offset}px)`;
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once on init to set initial positions
  updateParallax();
}

/* --------------------------------------------------------------------------
   Public API — Initialize all animation features
   -------------------------------------------------------------------------- */

/**
 * Initialize the full animation system.
 * Called from app.js on DOMContentLoaded.
 */
export function initAnimations() {
  initScrollAnimations();
  initParallax();
}
