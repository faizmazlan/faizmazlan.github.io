/* ==========================================================================
   Navigation Module
   Sticky nav show/hide, active section tracking, smooth scroll, mobile menu
   ========================================================================== */

/**
 * Initialize all navigation behaviors.
 * Called on DOMContentLoaded.
 */
export function initNavigation() {
  const header = document.getElementById('site-header');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const mobileLinks = document.querySelectorAll('.mobile-menu__link');
  const heroSection = document.getElementById('hero');

  if (!header || !heroSection) return;

  // ---- Sticky nav: show/hide on scroll past hero ----
  initStickyNav(header, heroSection);

  // ---- Active section tracking via Intersection Observer ----
  initActiveSectionTracking(navLinks);

  // ---- Smooth scroll on link click ----
  initSmoothScroll([...navLinks, ...mobileLinks]);

  // ---- Mobile menu open/close with focus trap ----
  if (hamburger && mobileMenu) {
    initMobileMenu(hamburger, mobileMenu, mobileLinks, header);
  }

  // ---- Back-to-top button smooth scroll ----
  initBackToTop();
}

/* --------------------------------------------------------------------------
   Sticky Nav — Show/Hide on Scroll
   -------------------------------------------------------------------------- */
function initStickyNav(header, heroSection) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      // When hero is NOT intersecting (scrolled past), show nav
      if (!entry.isIntersecting) {
        header.classList.add('is-visible');
      } else {
        header.classList.remove('is-visible');
      }
    },
    {
      root: null,
      threshold: 0,
      // Trigger when the bottom of the hero leaves the top of the viewport
      rootMargin: '0px 0px 0px 0px',
    }
  );

  observer.observe(heroSection);
}

/* --------------------------------------------------------------------------
   Active Section Tracking via Intersection Observer
   -------------------------------------------------------------------------- */
function initActiveSectionTracking(navLinks) {
  const sectionIds = ['about', 'experience', 'skills', 'projects', 'education', 'certifications', 'contact'];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveLink(navLinks, id);
        }
      });
    },
    {
      root: null,
      // Offset so the section is considered "active" when it's in the middle area
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Set the active nav link based on section id.
 * @param {NodeList|Array} navLinks - Collection of nav link elements
 * @param {string} activeId - The section ID to mark as active
 */
export function setActiveLink(navLinks, activeId) {
  navLinks.forEach((link) => {
    // Skip download links — they should never be marked as active
    if (link.hasAttribute('data-download')) return;

    const href = link.getAttribute('href');
    if (href === `#${activeId}`) {
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'true');
    } else {
      link.classList.remove('is-active');
      link.removeAttribute('aria-current');
    }
  });
}

/* --------------------------------------------------------------------------
   Smooth Scroll on Link Click
   -------------------------------------------------------------------------- */

/**
 * Handle a smooth scroll click event for a navigation link.
 * Returns early without calling preventDefault if href doesn't start with '#'.
 * @param {HTMLAnchorElement} link - The anchor element clicked
 * @param {Event} e - The click event
 */
export function handleSmoothScrollClick(link, e) {
  const href = link.getAttribute('href');
  if (!href || !href.startsWith('#')) return;

  const target = document.querySelector(href);
  if (!target) return;

  e.preventDefault();

  // Offset for the fixed nav height (48px)
  const navHeight = 48;
  const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;

  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  });

  // Update URL hash without jumping
  history.pushState(null, '', href);
}

function initSmoothScroll(links) {
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      handleSmoothScrollClick(link, e);
    });
  });
}

/* --------------------------------------------------------------------------
   Mobile Menu — Open/Close with Focus Trap
   -------------------------------------------------------------------------- */
function initMobileMenu(hamburger, mobileMenu, mobileLinks, header) {
  let isOpen = false;
  let previouslyFocused = null;

  function openMenu() {
    isOpen = true;
    previouslyFocused = document.activeElement;

    mobileMenu.hidden = false;
    // Force reflow so the transition plays
    void mobileMenu.offsetHeight;
    mobileMenu.classList.add('is-open');

    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    document.body.style.overflow = 'hidden';

    // Focus the first link after animation
    setTimeout(() => {
      if (mobileLinks.length > 0) {
        mobileLinks[0].focus();
      }
    }, 100);

    // Add keydown listener for focus trap and Escape
    document.addEventListener('keydown', handleMenuKeydown);
  }

  function closeMenu() {
    isOpen = false;
    mobileMenu.classList.remove('is-open');

    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';

    document.removeEventListener('keydown', handleMenuKeydown);

    // Hide after transition completes
    setTimeout(() => {
      if (!isOpen) {
        mobileMenu.hidden = true;
      }
    }, 400);

    // Restore focus
    if (previouslyFocused) {
      previouslyFocused.focus();
    }
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function handleMenuKeydown(e) {
    if (e.key === 'Escape') {
      closeMenu();
      return;
    }

    // Focus trap: Tab and Shift+Tab cycle within the menu
    if (e.key === 'Tab') {
      const focusableElements = [
        hamburger,
        ...mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])'),
      ];

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  // Hamburger click
  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a mobile link is clicked
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* --------------------------------------------------------------------------
   Back-to-Top Button — Smooth Scroll
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   Initialization is handled by app.js — the main entry point.
   -------------------------------------------------------------------------- */
