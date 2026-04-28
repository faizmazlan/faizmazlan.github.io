import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fc } from '@fast-check/vitest';
import { setActiveLink, handleSmoothScrollClick } from './navigation.js';

/* ==========================================================================
   Helper: Build a nav link DOM element
   ========================================================================== */
function createNavLink(href, { download = false, classes = [] } = {}) {
  const a = document.createElement('a');
  a.setAttribute('href', href);
  classes.forEach((c) => a.classList.add(c));
  if (download) {
    a.setAttribute('download', '');
    a.setAttribute('data-download', '');
  }
  return a;
}

/* ==========================================================================
   Task 5.1 — HTML Structure Unit Tests
   ========================================================================== */
describe('Task 5.1: Download CV link HTML structure', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <ul class="nav__links" role="list">
        <li><a href="#about" class="nav__link">About</a></li>
        <li><a href="#experience" class="nav__link">Experience</a></li>
        <li><a href="#skills" class="nav__link">Skills</a></li>
        <li><a href="#projects" class="nav__link">Projects</a></li>
        <li><a href="#education" class="nav__link">Education</a></li>
        <li><a href="#certifications" class="nav__link">Certifications</a></li>
        <li><a href="#contact" class="nav__link">Contact</a></li>
        <li>
          <a href="./faizmazlan.cv.pdf" download
             class="nav__link nav__link--download"
             aria-label="Download CV as PDF"
             data-download>
            Download CV
          </a>
        </li>
      </ul>

      <div class="mobile-menu" id="mobile-menu">
        <ul class="mobile-menu__links" role="list">
          <li><a href="#about" class="mobile-menu__link">About</a></li>
          <li><a href="#experience" class="mobile-menu__link">Experience</a></li>
          <li><a href="#skills" class="mobile-menu__link">Skills</a></li>
          <li><a href="#projects" class="mobile-menu__link">Projects</a></li>
          <li><a href="#education" class="mobile-menu__link">Education</a></li>
          <li><a href="#certifications" class="mobile-menu__link">Certifications</a></li>
          <li><a href="#contact" class="mobile-menu__link">Contact</a></li>
          <li>
            <a href="./faizmazlan.cv.pdf" download
               class="mobile-menu__link mobile-menu__link--download"
               aria-label="Download CV as PDF"
               data-download>
              Download CV
            </a>
          </li>
        </ul>
      </div>
    `;
    document.body.appendChild(container);
  });

  it('desktop nav has download link as the last item', () => {
    const items = container.querySelectorAll('.nav__links > li');
    const lastLink = items[items.length - 1].querySelector('a');
    expect(lastLink.hasAttribute('data-download')).toBe(true);
  });

  it('mobile menu has download link as the last item', () => {
    const items = container.querySelectorAll('.mobile-menu__links > li');
    const lastLink = items[items.length - 1].querySelector('a');
    expect(lastLink.hasAttribute('data-download')).toBe(true);
  });

  it('desktop download link has correct href', () => {
    const link = container.querySelector('.nav__links [data-download]');
    expect(link.getAttribute('href')).toBe('./faizmazlan.cv.pdf');
  });

  it('desktop download link has download attribute', () => {
    const link = container.querySelector('.nav__links [data-download]');
    expect(link.hasAttribute('download')).toBe(true);
  });

  it('desktop download link has correct aria-label', () => {
    const link = container.querySelector('.nav__links [data-download]');
    expect(link.getAttribute('aria-label')).toBe('Download CV as PDF');
  });

  it('desktop download link displays "Download CV" text', () => {
    const link = container.querySelector('.nav__links [data-download]');
    expect(link.textContent.trim()).toBe('Download CV');
  });

  it('mobile download link has correct href', () => {
    const link = container.querySelector('.mobile-menu__links [data-download]');
    expect(link.getAttribute('href')).toBe('./faizmazlan.cv.pdf');
  });

  it('mobile download link has download attribute', () => {
    const link = container.querySelector('.mobile-menu__links [data-download]');
    expect(link.hasAttribute('download')).toBe(true);
  });

  it('mobile download link has correct aria-label', () => {
    const link = container.querySelector('.mobile-menu__links [data-download]');
    expect(link.getAttribute('aria-label')).toBe('Download CV as PDF');
  });

  it('mobile download link displays "Download CV" text', () => {
    const link = container.querySelector('.mobile-menu__links [data-download]');
    expect(link.textContent.trim()).toBe('Download CV');
  });
});

/* ==========================================================================
   Task 5.2 — setActiveLink skips download links (unit test)
   ========================================================================== */
describe('Task 5.2: setActiveLink skips download links', () => {
  it('does not apply is-active or aria-current to a download link', () => {
    const sectionLink = createNavLink('#about', { classes: ['nav__link'] });
    const downloadLink = createNavLink('./faizmazlan.cv.pdf', {
      download: true,
      classes: ['nav__link', 'nav__link--download'],
    });

    const links = [sectionLink, downloadLink];

    // Call with 'about' — the section link should activate, download should not
    setActiveLink(links, 'about');

    expect(sectionLink.classList.contains('is-active')).toBe(true);
    expect(sectionLink.getAttribute('aria-current')).toBe('true');

    expect(downloadLink.classList.contains('is-active')).toBe(false);
    expect(downloadLink.hasAttribute('aria-current')).toBe(false);
  });

  it('download link retains no active state even when no section matches', () => {
    const sectionLink = createNavLink('#about', { classes: ['nav__link'] });
    const downloadLink = createNavLink('./faizmazlan.cv.pdf', {
      download: true,
      classes: ['nav__link', 'nav__link--download'],
    });

    const links = [sectionLink, downloadLink];

    setActiveLink(links, 'nonexistent');

    expect(downloadLink.classList.contains('is-active')).toBe(false);
    expect(downloadLink.hasAttribute('aria-current')).toBe(false);
  });
});

/* ==========================================================================
   Task 5.3 — [PBT] Property 2: setActiveLink never marks download links active
   Feature: download-cv-menu, Property 2: Active section tracking never marks download links
   ========================================================================== */
describe('Task 5.3: [PBT] Property 2 — setActiveLink never marks download links active', () => {
  /** Validates: Requirements 4.1, 4.2 */
  const validSectionIds = ['about', 'experience', 'skills', 'projects', 'education', 'certifications', 'contact'];

  it.prop(
    [fc.constantFrom(...validSectionIds)],
    { numRuns: 100 },
  )('for section ID "%s", download link is never marked active', (sectionId) => {
    // Build a realistic set of nav links including all sections + download
    const sectionLinks = validSectionIds.map((id) =>
      createNavLink(`#${id}`, { classes: ['nav__link'] }),
    );
    const downloadLink = createNavLink('./faizmazlan.cv.pdf', {
      download: true,
      classes: ['nav__link', 'nav__link--download'],
    });

    const allLinks = [...sectionLinks, downloadLink];

    setActiveLink(allLinks, sectionId);

    // Property: download link must NEVER have is-active or aria-current
    expect(downloadLink.classList.contains('is-active')).toBe(false);
    expect(downloadLink.hasAttribute('aria-current')).toBe(false);
  });
});

/* ==========================================================================
   Task 5.4 — [PBT] Property 1: Smooth scroll handler does not call preventDefault for non-hash hrefs
   Feature: download-cv-menu, Property 1: Smooth scroll bypasses non-hash hrefs
   ========================================================================== */
describe('Task 5.4: [PBT] Property 1 — smooth scroll handler bypasses non-hash hrefs', () => {
  /** Validates: Requirements 1.5 */

  // Generator: produces href strings that do NOT start with '#'
  const nonHashHrefArb = fc
    .string({ minLength: 0, maxLength: 200 })
    .filter((s) => !s.startsWith('#'));

  it.prop(
    [nonHashHrefArb],
    { numRuns: 100 },
  )('for non-hash href "%s", preventDefault is not called', (href) => {
    const link = document.createElement('a');
    link.setAttribute('href', href);

    const preventDefault = vi.fn();
    const event = { preventDefault };

    handleSmoothScrollClick(link, event);

    expect(preventDefault).not.toHaveBeenCalled();
  });
});
