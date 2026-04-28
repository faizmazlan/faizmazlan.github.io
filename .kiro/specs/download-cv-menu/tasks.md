# Tasks — Download CV Menu

## Task 1: Add Download CV links to HTML

- [x] 1.1 Add a Download CV `<li>` as the last item in `ul.nav__links` in `index.html` with `href="./faizmazlan.cv.pdf"`, `download` attribute, `class="nav__link nav__link--download"`, `aria-label="Download CV as PDF"`, and `data-download` attribute
- [x] 1.2 Add a Download CV `<li>` as the last item in `ul.mobile-menu__links` in `index.html` with `href="./faizmazlan.cv.pdf"`, `download` attribute, `class="mobile-menu__link mobile-menu__link--download"`, `aria-label="Download CV as PDF"`, and `data-download` attribute

## Task 2: Add CSS styles for download link

- [x] 2.1 Add `.nav__link--download` styles in `css/components.css`: accent colour text, accent-hover on hover, and `display: none` on the `::after` pseudo-element to remove the underline animation
- [x] 2.2 Add `.mobile-menu__link--download` styles in `css/components.css`: accent colour text and accent-hover on hover
- [x] 2.3 Add `nth-child(8)` staggered animation delay rule (640ms) for the mobile menu download link in `css/components.css`

## Task 3: Update navigation JS for active-section tracking exclusion

- [x] 3.1 Modify `setActiveLink` in `js/navigation.js` to skip links with the `[data-download]` attribute when applying `is-active` class and `aria-current` attribute

## Task 4: Update build script to copy CV PDF to dist

- [x] 4.1 Update `build.mjs` to copy `faizmazlan.cv.pdf` to the `dist/` directory during build

## Task 5: Write tests

- [-] 5.1 Write unit tests verifying HTML structure: download link exists in desktop nav and mobile menu as last items, correct href, download attribute, aria-label, and text content
- [-] 5.2 Write unit test verifying `setActiveLink` skips download links (does not apply `is-active` or `aria-current` to elements with `[data-download]`)
- [-] 5.3 [PBT] Write property test: for any valid section ID, `setActiveLink` never marks a `[data-download]` link as active (Property 2)
- [-] 5.4 [PBT] Write property test: for any non-hash href string, the smooth scroll click handler does not call `preventDefault` (Property 1)
