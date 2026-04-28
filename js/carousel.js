/* ==========================================================================
   Carousel Module
   Certifications carousel: navigation, pagination, transitions
   ========================================================================== */

/* --------------------------------------------------------------------------
   Pure Helper Functions (exported for property-based testing)
   -------------------------------------------------------------------------- */

/**
 * Clamp an index to [0, maxIndex].
 * @param {number} index - Requested index
 * @param {number} maxIndex - Maximum valid index
 * @returns {number} Clamped index
 */
export function clampIndex(index, maxIndex) {
  return Math.max(0, Math.min(index, maxIndex));
}

/**
 * Compute the track translateX offset.
 * @param {number} currentIndex - Current slide index
 * @param {number} slideWidth - Width of one slide in px
 * @returns {number} Negative pixel offset
 */
export function computeTrackOffset(currentIndex, slideWidth) {
  return -(currentIndex * slideWidth);
}

/**
 * Compute the number of pagination dots.
 * @param {number} totalSlides - Total number of slides
 * @param {number} slidesPerView - Slides visible at once
 * @returns {number} Number of dots
 */
export function computeDotCount(totalSlides, slidesPerView) {
  return Math.max(0, totalSlides - slidesPerView) + 1;
}

/**
 * Classify a touch gesture as a swipe or not.
 * @param {number} deltaX - Horizontal distance (positive = right)
 * @param {number} deltaY - Vertical distance
 * @returns {{ isSwipe: boolean, direction: 'prev'|'next'|null }}
 */
export function classifySwipe(deltaX, deltaY) {
  const absDx = Math.abs(deltaX);
  const absDy = Math.abs(deltaY);

  if (absDx >= 30 && absDx > absDy) {
    return { isSwipe: true, direction: deltaX < 0 ? 'next' : 'prev' };
  }
  return { isSwipe: false, direction: null };
}

/**
 * Compute the track offset during a drag gesture.
 * @param {number} currentIndex - Current slide index
 * @param {number} slideWidth - Width of one slide in px
 * @param {number} dragDelta - Drag distance in px
 * @returns {number} Pixel offset including drag
 */
export function computeDragOffset(currentIndex, slideWidth, dragDelta) {
  return -(currentIndex * slideWidth) + dragDelta;
}

/* --------------------------------------------------------------------------
   Carousel Initialization
   -------------------------------------------------------------------------- */

/**
 * Initialize the certifications carousel.
 * Queries the DOM for .certifications__carousel, sets up
 * navigation, pagination, and transitions.
 * Safe to call if no carousel element exists (no-ops).
 */
export function initCarousel() {
  const carousel = document.querySelector('.certifications__carousel');
  if (!carousel) return;

  const viewport = carousel.querySelector('.certifications__viewport');
  const track = carousel.querySelector('.certifications__track');
  const slides = track ? track.querySelectorAll('.certifications__slide') : [];
  const prevArrow = carousel.querySelector('.certifications__arrow--prev');
  const nextArrow = carousel.querySelector('.certifications__arrow--next');
  const pagination = carousel.querySelector('.certifications__pagination');

  if (!track || slides.length === 0) return;

  // ---- State ----
  let currentIndex = 0;
  let isTransitioning = false;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchCurrentX = 0;
  let touchCurrentY = 0;
  let isDragging = false;

  function readSlidesPerView() {
    const raw = getComputedStyle(carousel).getPropertyValue('--slides-per-view');
    return parseInt(raw, 10) || 1;
  }

  function getMaxIndex(slidesPerView) {
    return Math.max(0, slides.length - slidesPerView);
  }

  let slidesPerView = readSlidesPerView();
  let maxIndex = getMaxIndex(slidesPerView);

  // ---- 4.3: Update Track Position ----
  function updateTrackPosition(animate = true) {
    let offset;
    if (currentIndex >= maxIndex) {
      // At the end: align track's right edge with viewport's right edge
      offset = -(track.scrollWidth - viewport.offsetWidth);
    } else {
      // Otherwise: align to the target slide's left edge
      const targetSlide = slides[currentIndex];
      offset = targetSlide ? -targetSlide.offsetLeft : 0;
    }

    if (animate) {
      track.style.transition = '';
      isTransitioning = true;

      const onEnd = () => {
        isTransitioning = false;
        track.removeEventListener('transitionend', onEnd);
      };
      track.addEventListener('transitionend', onEnd);

      // Fallback in case transitionend doesn't fire (e.g. reduced motion)
      setTimeout(() => {
        isTransitioning = false;
        track.removeEventListener('transitionend', onEnd);
      }, 400);
    } else {
      track.style.transition = 'none';
      isTransitioning = false;
    }

    track.style.transform = `translateX(${offset}px)`;
  }

  // ---- 4.4: Update Arrows ----
  function updateArrows() {
    if (prevArrow) {
      if (currentIndex === 0) {
        prevArrow.setAttribute('aria-disabled', 'true');
        prevArrow.classList.add('certifications__arrow--disabled');
      } else {
        prevArrow.setAttribute('aria-disabled', 'false');
        prevArrow.classList.remove('certifications__arrow--disabled');
      }
    }

    if (nextArrow) {
      if (currentIndex === maxIndex) {
        nextArrow.setAttribute('aria-disabled', 'true');
        nextArrow.classList.add('certifications__arrow--disabled');
      } else {
        nextArrow.setAttribute('aria-disabled', 'false');
        nextArrow.classList.remove('certifications__arrow--disabled');
      }
    }
  }

  // ---- 4.5: Update Dots ----
  function updateDots() {
    if (!pagination) return;

    const dotCount = computeDotCount(slides.length, slidesPerView);

    // Regenerate dots if count changed
    if (pagination.children.length !== dotCount) {
      pagination.innerHTML = '';
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.className = 'certifications__dot';
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          if (!isTransitioning) {
            goToSlide(i);
          }
        });
        pagination.appendChild(dot);
      }
    }

    // Toggle active state
    const dots = pagination.querySelectorAll('.certifications__dot');
    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('certifications__dot--active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('certifications__dot--active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  }

  // ---- 4.2: Go To Slide ----
  function goToSlide(index) {
    if (isTransitioning) return;

    currentIndex = clampIndex(index, maxIndex);
    updateTrackPosition();
    updateArrows();
    updateDots();
  }

  // ---- 4.6: Arrow Click Listeners ----
  if (prevArrow) {
    prevArrow.addEventListener('click', () => {
      if (!isTransitioning) {
        goToSlide(currentIndex - 1);
      }
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener('click', () => {
      if (!isTransitioning) {
        goToSlide(currentIndex + 1);
      }
    });
  }

  // ---- 5.1: Touch Start ----
  track.addEventListener('touchstart', (e) => {
    if (isTransitioning) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchCurrentX = touchStartX;
    touchCurrentY = touchStartY;
    isDragging = true;
  }, { passive: true });

  // ---- 5.2: Touch Move ----
  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    touchCurrentX = e.touches[0].clientX;
    touchCurrentY = e.touches[0].clientY;
    const dragDelta = touchCurrentX - touchStartX;
    const deltaY = touchCurrentY - touchStartY;

    // Only prevent default (block vertical scroll) when horizontal movement dominates
    if (Math.abs(dragDelta) > Math.abs(deltaY)) {
      e.preventDefault();
    }

    // Apply live drag offset without transition
    const baseOffset = slides[currentIndex] ? -slides[currentIndex].offsetLeft : 0;
    const offset = baseOffset + dragDelta;
    track.style.transition = 'none';
    track.style.transform = `translateX(${offset}px)`;
  }, { passive: false });

  // ---- 5.3: Touch End ----
  track.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;

    const deltaX = touchCurrentX - touchStartX;
    const deltaY = touchCurrentY - touchStartY;
    const result = classifySwipe(deltaX, deltaY);

    if (result.isSwipe) {
      if (result.direction === 'next') {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    } else {
      // Snap back to current position with animation
      updateTrackPosition(true);
    }
  });

  // ---- 6.1: Keyboard Navigation ----
  carousel.setAttribute('tabindex', '0');

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToSlide(currentIndex + 1);
    }
  });

  // ---- 6.2: Resize Handler (debounced) ----
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      slidesPerView = readSlidesPerView();
      maxIndex = getMaxIndex(slidesPerView);
      currentIndex = clampIndex(currentIndex, maxIndex);
      updateDots();
      updateArrows();
      updateTrackPosition(false); // no animation on resize
    }, 150);
  });

  // ---- Wheel / Scroll Navigation (Apple-style) ----
  let wheelAccumulator = 0;
  let wheelTimer;
  const WHEEL_THRESHOLD = 50; // px of accumulated scroll before advancing a slide

  carousel.addEventListener('wheel', (e) => {
    // Use the dominant axis — vertical scroll drives the carousel
    const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

    // Ignore tiny trackpad noise
    if (Math.abs(delta) < 2) return;

    e.preventDefault();

    wheelAccumulator += delta;

    // Reset accumulator after a pause in scrolling
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => {
      wheelAccumulator = 0;
    }, 200);

    if (Math.abs(wheelAccumulator) >= WHEEL_THRESHOLD) {
      if (wheelAccumulator > 0 && currentIndex < maxIndex) {
        goToSlide(currentIndex + 1);
      } else if (wheelAccumulator < 0 && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      }
      wheelAccumulator = 0;
    }
  }, { passive: false });

  // ---- Initial render ----
  updateTrackPosition(false);
  updateArrows();
  updateDots();
}
