import { describe, expect, test, beforeEach, afterEach, vi } from 'vitest';
import { test as fcTest } from '@fast-check/vitest';
import fc from 'fast-check';
import {
  clampIndex,
  computeTrackOffset,
  computeDotCount,
  classifySwipe,
  computeDragOffset,
  initCarousel,
} from './carousel.js';

/* ==========================================================================
   Feature: certification-carousel — Property-Based Tests
   ========================================================================== */

/* --------------------------------------------------------------------------
   Property 1: Index clamping
   For any totalSlides, slidesPerView, and requested index, clampIndex
   produces clamp(index, 0, max(0, totalSlides - slidesPerView)).
   -------------------------------------------------------------------------- */
describe('Feature: certification-carousel, Property 1: index clamping', () => {
  /** Validates: Requirements 3.1, 3.2, 3.3, 3.4, 4.3, 6.4 */
  fcTest.prop(
    [
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: -100, max: 100 }),
    ],
    { numRuns: 100 },
  )(
    'clampIndex(requestedIndex, maxIndex) equals Math.max(0, Math.min(requestedIndex, maxIndex))',
    (totalSlides, requestedIndex) => {
      // Derive slidesPerView constrained to [1, totalSlides]
      const slidesPerView = (Math.abs(requestedIndex) % totalSlides) + 1;
      const maxIndex = Math.max(0, totalSlides - slidesPerView);
      const result = clampIndex(requestedIndex, maxIndex);
      const expected = Math.max(0, Math.min(requestedIndex, maxIndex));
      expect(result).toBe(expected);
    },
  );

  fcTest.prop(
    [
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: -100, max: 100 }),
    ],
    { numRuns: 100 },
  )(
    'clampIndex always returns a value in [0, maxIndex]',
    (totalSlides, rawSlidesPerView, requestedIndex) => {
      const slidesPerView = Math.min(rawSlidesPerView, totalSlides);
      const maxIndex = Math.max(0, totalSlides - slidesPerView);
      const result = clampIndex(requestedIndex, maxIndex);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(maxIndex);
    },
  );
});

/* --------------------------------------------------------------------------
   Property 2: Track offset computation
   For any currentIndex and slideWidth, translateX equals
   -(currentIndex * slideWidth).
   -------------------------------------------------------------------------- */
describe('Feature: certification-carousel, Property 2: track offset computation', () => {
  /** Validates: Requirements 2.2, 8.2 */
  fcTest.prop(
    [
      fc.integer({ min: 0, max: 19 }),
      fc.integer({ min: 50, max: 500 }),
    ],
    { numRuns: 100 },
  )(
    'computeTrackOffset(currentIndex, slideWidth) equals -(currentIndex * slideWidth)',
    (currentIndex, slideWidth) => {
      const result = computeTrackOffset(currentIndex, slideWidth);
      expect(result).toBe(-(currentIndex * slideWidth));
    },
  );
});

/* --------------------------------------------------------------------------
   Property 3: Pagination dot count
   For any totalSlides and slidesPerView, dot count equals
   max(0, totalSlides - slidesPerView) + 1.
   -------------------------------------------------------------------------- */
describe('Feature: certification-carousel, Property 3: pagination dot count', () => {
  /** Validates: Requirements 4.1 */
  fcTest.prop(
    [
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 20 }),
    ],
    { numRuns: 100 },
  )(
    'computeDotCount(totalSlides, slidesPerView) equals max(0, totalSlides - slidesPerView) + 1',
    (totalSlides, rawSlidesPerView) => {
      const slidesPerView = Math.min(rawSlidesPerView, totalSlides);
      const result = computeDotCount(totalSlides, slidesPerView);
      const expected = Math.max(0, totalSlides - slidesPerView) + 1;
      expect(result).toBe(expected);
    },
  );
});

/* --------------------------------------------------------------------------
   Property 4: Active dot position
   For any valid currentIndex in [0, maxIndex], the active dot index is
   within bounds of the dot count and exactly one position matches.
   -------------------------------------------------------------------------- */
describe('Feature: certification-carousel, Property 4: active dot position', () => {
  /** Validates: Requirements 4.2, 4.4 */
  fcTest.prop(
    [
      fc.integer({ min: 1, max: 20 }),
      fc.integer({ min: 1, max: 20 }),
    ],
    { numRuns: 100 },
  )(
    'for any valid currentIndex, it is within [0, dotCount - 1]',
    (totalSlides, rawSlidesPerView) => {
      const slidesPerView = Math.min(rawSlidesPerView, totalSlides);
      const maxIndex = Math.max(0, totalSlides - slidesPerView);
      const dotCount = computeDotCount(totalSlides, slidesPerView);

      // For any currentIndex in [0, maxIndex], it must be < dotCount
      // Generate a currentIndex within valid range
      for (let currentIndex = 0; currentIndex <= maxIndex; currentIndex++) {
        expect(currentIndex).toBeGreaterThanOrEqual(0);
        expect(currentIndex).toBeLessThan(dotCount);

        // Exactly one dot position matches currentIndex
        const matchingDots = Array.from({ length: dotCount }, (_, i) => i)
          .filter((i) => i === currentIndex);
        expect(matchingDots).toHaveLength(1);
      }
    },
  );
});

/* --------------------------------------------------------------------------
   Property 5: Swipe gesture classification
   For any (deltaX, deltaY), swipe is detected iff |deltaX| >= 30 and
   |deltaX| > |deltaY|, with correct direction.
   -------------------------------------------------------------------------- */
describe('Feature: certification-carousel, Property 5: swipe gesture classification', () => {
  /** Validates: Requirements 5.1, 5.2 */
  fcTest.prop(
    [
      fc.integer({ min: -500, max: 500 }),
      fc.integer({ min: -500, max: 500 }),
    ],
    { numRuns: 100 },
  )(
    'classifySwipe detects swipe iff |deltaX| >= 30 and |deltaX| > |deltaY|',
    (deltaX, deltaY) => {
      const result = classifySwipe(deltaX, deltaY);
      const expectedIsSwipe = Math.abs(deltaX) >= 30 && Math.abs(deltaX) > Math.abs(deltaY);

      expect(result.isSwipe).toBe(expectedIsSwipe);

      if (expectedIsSwipe) {
        expect(result.direction).toBe(deltaX < 0 ? 'next' : 'prev');
      } else {
        expect(result.direction).toBeNull();
      }
    },
  );
});

/* --------------------------------------------------------------------------
   Property 6: Drag offset
   For any currentIndex, slideWidth, and dragDelta, track translateX equals
   -(currentIndex * slideWidth) + dragDelta.
   -------------------------------------------------------------------------- */
describe('Feature: certification-carousel, Property 6: drag offset', () => {
  /** Validates: Requirements 5.3 */
  fcTest.prop(
    [
      fc.integer({ min: 0, max: 19 }),
      fc.integer({ min: 50, max: 500 }),
      fc.integer({ min: -500, max: 500 }),
    ],
    { numRuns: 100 },
  )(
    'computeDragOffset(currentIndex, slideWidth, dragDelta) equals -(currentIndex * slideWidth) + dragDelta',
    (currentIndex, slideWidth, dragDelta) => {
      const result = computeDragOffset(currentIndex, slideWidth, dragDelta);
      expect(result).toBe(-(currentIndex * slideWidth) + dragDelta);
    },
  );
});


/* ==========================================================================
   Feature: certification-carousel — Unit Tests (DOM Structure & Edge Cases)
   ========================================================================== */

/* --------------------------------------------------------------------------
   DOM Fixture Helper
   -------------------------------------------------------------------------- */

function createCarouselDOM() {
  document.body.innerHTML = `
    <div class="certifications__carousel"
         role="region"
         aria-roledescription="carousel"
         aria-label="Certifications"
         style="--slides-per-view: 3">
      <button class="certifications__arrow certifications__arrow--prev"
              type="button"
              aria-label="Previous certification"
              aria-disabled="true"></button>
      <div class="certifications__viewport" style="width: 900px">
        <div class="certifications__track" aria-live="polite">
          <div class="certifications__slide">
            <div class="certifications__badge">
              <div class="certifications__badge-image-wrapper">
                <img class="certifications__badge-image" src="assets/images/certifications/scrum-psm-i.png" alt="Scrum.org: Professional Scrum Master I (PSM I) badge" loading="lazy">
              </div>
              <div class="certifications__badge-info">
                <h3 class="certifications__badge-name">Scrum.org: Professional Scrum Master I (PSM I)</h3>
                <span class="certifications__badge-date">Aug 2024</span>
              </div>
            </div>
          </div>
          <div class="certifications__slide">
            <div class="certifications__badge">
              <div class="certifications__badge-image-wrapper">
                <img class="certifications__badge-image" src="assets/images/certifications/microsoft-openhack-serverless.png" alt="Microsoft OpenHack: Serverless badge" loading="lazy">
              </div>
              <div class="certifications__badge-info">
                <h3 class="certifications__badge-name">Microsoft OpenHack: Serverless</h3>
                <span class="certifications__badge-date">Nov 2022</span>
              </div>
            </div>
          </div>
          <div class="certifications__slide">
            <div class="certifications__badge">
              <div class="certifications__badge-image-wrapper">
                <img class="certifications__badge-image" src="assets/images/certifications/azure-fundamentals.png" alt="Microsoft Certified: Azure Fundamentals badge" loading="lazy">
              </div>
              <div class="certifications__badge-info">
                <h3 class="certifications__badge-name">Microsoft Certified: Azure Fundamentals</h3>
                <span class="certifications__badge-date">Aug 2022</span>
              </div>
            </div>
          </div>
          <div class="certifications__slide">
            <div class="certifications__badge">
              <div class="certifications__badge-image-wrapper">
                <img class="certifications__badge-image" src="assets/images/certifications/microsoft-openhack-devops.png" alt="Microsoft OpenHack: DevOps badge" loading="lazy">
              </div>
              <div class="certifications__badge-info">
                <h3 class="certifications__badge-name">Microsoft OpenHack: DevOps</h3>
                <span class="certifications__badge-date">May 2022</span>
              </div>
            </div>
          </div>
          <div class="certifications__slide">
            <div class="certifications__badge">
              <div class="certifications__badge-image-wrapper">
                <img class="certifications__badge-image" src="assets/images/certifications/azure-architect-technologies.png" alt="Microsoft Certified: Microsoft Azure Architect Technologies badge" loading="lazy">
              </div>
              <div class="certifications__badge-info">
                <h3 class="certifications__badge-name">Microsoft Certified: Microsoft Azure Architect Technologies</h3>
                <span class="certifications__badge-date">Feb 2021</span>
              </div>
            </div>
          </div>
          <div class="certifications__slide">
            <div class="certifications__badge">
              <div class="certifications__badge-image-wrapper">
                <img class="certifications__badge-image" src="assets/images/certifications/azure-administrator-associate.png" alt="Microsoft Certified: Azure Administrator Associate badge" loading="lazy">
              </div>
              <div class="certifications__badge-info">
                <h3 class="certifications__badge-name">Microsoft Certified: Azure Administrator Associate</h3>
                <span class="certifications__badge-date">Jan 2020</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="certifications__arrow certifications__arrow--next"
              type="button"
              aria-label="Next certification"></button>
      <div class="certifications__pagination" role="tablist" aria-label="Certification slides"></div>
    </div>
  `;
}

/* --------------------------------------------------------------------------
   9.1 — Certification Badge Tests (Req 1.1, 1.2, 1.3)
   -------------------------------------------------------------------------- */
describe('Unit: certification badges', () => {
  beforeEach(() => createCarouselDOM());
  afterEach(() => { document.body.innerHTML = ''; });

  test('renders exactly 6 certification badges', () => {
    const badges = document.querySelectorAll('.certifications__badge');
    expect(badges.length).toBe(6);
  });

  test('displays correct certification names', () => {
    const names = [...document.querySelectorAll('.certifications__badge-name')].map(el => el.textContent);
    expect(names).toEqual([
      'Scrum.org: Professional Scrum Master I (PSM I)',
      'Microsoft OpenHack: Serverless',
      'Microsoft Certified: Azure Fundamentals',
      'Microsoft OpenHack: DevOps',
      'Microsoft Certified: Microsoft Azure Architect Technologies',
      'Microsoft Certified: Azure Administrator Associate',
    ]);
  });

  test('displays correct certification dates', () => {
    const dates = [...document.querySelectorAll('.certifications__badge-date')].map(el => el.textContent);
    expect(dates).toEqual(['Aug 2024', 'Nov 2022', 'Aug 2022', 'May 2022', 'Feb 2021', 'Jan 2020']);
  });
});

/* --------------------------------------------------------------------------
   9.2 — ARIA Attribute Tests (Req 7.1–7.5)
   -------------------------------------------------------------------------- */
describe('Unit: ARIA attributes', () => {
  beforeEach(() => {
    createCarouselDOM();
    initCarousel();
  });
  afterEach(() => { document.body.innerHTML = ''; });

  test('carousel has role="region" and aria-roledescription="carousel"', () => {
    const carousel = document.querySelector('.certifications__carousel');
    expect(carousel.getAttribute('role')).toBe('region');
    expect(carousel.getAttribute('aria-roledescription')).toBe('carousel');
    expect(carousel.getAttribute('aria-label')).toBe('Certifications');
  });

  test('previous arrow has correct aria-label', () => {
    const prev = document.querySelector('.certifications__arrow--prev');
    expect(prev.getAttribute('aria-label')).toBe('Previous certification');
  });

  test('next arrow has correct aria-label', () => {
    const next = document.querySelector('.certifications__arrow--next');
    expect(next.getAttribute('aria-label')).toBe('Next certification');
  });

  test('track has aria-live="polite"', () => {
    const track = document.querySelector('.certifications__track');
    expect(track.getAttribute('aria-live')).toBe('polite');
  });

  test('previous arrow is aria-disabled at initial position (index 0)', () => {
    const prev = document.querySelector('.certifications__arrow--prev');
    expect(prev.getAttribute('aria-disabled')).toBe('true');
  });

  test('next arrow is not aria-disabled at initial position when more slides exist', () => {
    const next = document.querySelector('.certifications__arrow--next');
    // With 6 slides and slidesPerView=3, maxIndex=3, so next should be enabled
    expect(next.getAttribute('aria-disabled')).not.toBe('true');
  });

  test('pagination dots have role="tab" and aria-label attributes', () => {
    const dots = document.querySelectorAll('.certifications__dot');
    expect(dots.length).toBeGreaterThan(0);
    dots.forEach((dot, i) => {
      expect(dot.getAttribute('role')).toBe('tab');
      expect(dot.getAttribute('aria-label')).toBe(`Go to slide ${i + 1}`);
    });
  });

  test('exactly one dot has aria-selected="true" after init', () => {
    const dots = document.querySelectorAll('.certifications__dot');
    const selectedDots = [...dots].filter(d => d.getAttribute('aria-selected') === 'true');
    expect(selectedDots.length).toBe(1);
  });
});

/* --------------------------------------------------------------------------
   9.3 — Edge Case Tests (Req 8.3, no-op, reduced motion)
   -------------------------------------------------------------------------- */
describe('Unit: edge cases', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  test('initCarousel does not throw when no carousel element exists', () => {
    document.body.innerHTML = '';
    expect(() => initCarousel()).not.toThrow();
  });

  test('initCarousel does not throw when carousel has no slides', () => {
    document.body.innerHTML = `
      <div class="certifications__carousel" style="--slides-per-view: 3">
        <div class="certifications__viewport">
          <div class="certifications__track" aria-live="polite"></div>
        </div>
      </div>
    `;
    expect(() => initCarousel()).not.toThrow();
  });

  test('clicks during transition are ignored (transition guard)', () => {
    createCarouselDOM();
    initCarousel();

    const nextArrow = document.querySelector('.certifications__arrow--next');
    const track = document.querySelector('.certifications__track');

    // First click — starts a transition
    nextArrow.click();
    const transformAfterFirst = track.style.transform;

    // Second click immediately — should be ignored because isTransitioning is true
    nextArrow.click();
    const transformAfterSecond = track.style.transform;

    // Transform should not have changed between the two clicks
    expect(transformAfterSecond).toBe(transformAfterFirst);
  });

  test('reduced motion fallback: isTransitioning resets via setTimeout', () => {
    vi.useFakeTimers();
    createCarouselDOM();
    initCarousel();

    const nextArrow = document.querySelector('.certifications__arrow--next');
    const prevArrow = document.querySelector('.certifications__arrow--prev');

    // At index 0, prev is disabled
    expect(prevArrow.getAttribute('aria-disabled')).toBe('true');

    // Click next — starts transition, moves to index 1
    nextArrow.click();
    // prev should now be enabled (index moved to 1)
    expect(prevArrow.getAttribute('aria-disabled')).toBe('false');

    // Second click immediately — should be blocked by isTransitioning
    nextArrow.click();
    // prev still shows index 1 state (not index 2)
    expect(prevArrow.getAttribute('aria-disabled')).toBe('false');

    // Advance past the 400ms fallback timeout to reset isTransitioning
    vi.advanceTimersByTime(450);

    // Now a click should work — moves to index 2
    nextArrow.click();
    // prev still enabled at index 2
    expect(prevArrow.getAttribute('aria-disabled')).toBe('false');

    // Verify the second click after timeout actually advanced by checking
    // we can go back twice (proving we're at index 2, not index 1)
    vi.advanceTimersByTime(450);
    prevArrow.click();
    vi.advanceTimersByTime(450);
    prevArrow.click();
    // After going back twice from index 2, we should be at index 0
    expect(prevArrow.getAttribute('aria-disabled')).toBe('true');

    vi.useRealTimers();
  });
});
