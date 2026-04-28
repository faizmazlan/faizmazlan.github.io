# Requirements Document

## Introduction

Add a "Download CV" menu item to both the desktop navigation bar and the mobile overlay menu of Faiz Mazlan's portfolio website. This gives visitors a persistent way to download the CV PDF from any scroll position, complementing the existing download button in the hero section. The menu item should trigger a file download (not navigate to a new page) and be visually distinct from the section-navigation links to signal its different behaviour.

## Glossary

- **Desktop_Nav**: The horizontal navigation link list (`ul.nav__links`) visible on viewports wider than 768 px.
- **Mobile_Menu**: The full-screen overlay menu (`div.mobile-menu`) shown on viewports 768 px and narrower, toggled by the hamburger button.
- **Download_Link**: An anchor element (`<a>`) with `href` pointing to the CV PDF file and a `download` attribute that triggers a browser file-download instead of page navigation.
- **CV_PDF**: The file `faizmazlan.cv.pdf` located at the site root.
- **Section_Link**: An existing navigation anchor that scrolls to a page section (e.g., About, Experience).
- **Active_Section_Tracker**: The Intersection Observer logic in `navigation.js` that highlights the Section_Link corresponding to the currently visible section.
- **Focus_Trap**: The keyboard-navigation logic that constrains Tab/Shift-Tab cycling within the Mobile_Menu while it is open.
- **Smooth_Scroll_Handler**: The click-event listener in `navigation.js` that intercepts Section_Link clicks and performs animated scrolling.

## Requirements

### Requirement 1: Desktop Navigation Download Link

**User Story:** As a visitor browsing on a desktop viewport, I want a "Download CV" link in the navigation bar, so that I can download the CV from any scroll position without returning to the hero section.

#### Acceptance Criteria

1. WHEN the Desktop_Nav is rendered, THE Desktop_Nav SHALL contain a Download_Link as the last list item after the "Contact" Section_Link.
2. THE Download_Link SHALL have its `href` attribute set to `./faizmazlan.cv.pdf` and its `download` attribute present so the browser initiates a file download.
3. THE Download_Link SHALL display the text "Download CV".
4. THE Download_Link SHALL be visually distinguishable from Section_Links by using the site accent colour for its text colour in its default state.
5. WHEN a visitor activates the Download_Link, THE browser SHALL initiate a download of the CV_PDF and THE Smooth_Scroll_Handler SHALL NOT intercept the click.

### Requirement 2: Mobile Menu Download Link

**User Story:** As a visitor browsing on a mobile viewport, I want a "Download CV" link in the mobile overlay menu, so that I can download the CV without closing the menu and scrolling to the hero section.

#### Acceptance Criteria

1. WHEN the Mobile_Menu is rendered, THE Mobile_Menu SHALL contain a Download_Link as the last list item after the "Contact" Section_Link.
2. THE Download_Link SHALL have its `href` attribute set to `./faizmazlan.cv.pdf` and its `download` attribute present so the browser initiates a file download.
3. THE Download_Link SHALL display the text "Download CV".
4. THE Download_Link SHALL be visually distinguishable from Section_Links by using the site accent colour for its text colour in its default state.
5. WHEN a visitor activates the Download_Link in the Mobile_Menu, THE browser SHALL initiate a download of the CV_PDF and THE Mobile_Menu SHALL close.
6. WHEN the Mobile_Menu is open, THE Focus_Trap SHALL include the Download_Link in its Tab-cycle sequence.

### Requirement 3: Download Link Entrance Animation in Mobile Menu

**User Story:** As a visitor, I want the Download CV link in the mobile menu to animate in with the same staggered entrance as the other links, so that the menu feels cohesive.

#### Acceptance Criteria

1. WHEN the Mobile_Menu opens, THE Download_Link SHALL animate in with the same staggered fade-and-slide transition applied to the Section_Links.
2. THE Download_Link entrance animation delay SHALL follow sequentially after the last Section_Link (Contact) delay.

### Requirement 4: Active-Section Tracking Exclusion

**User Story:** As a developer, I want the Download CV link excluded from active-section highlighting, so that the active-section indicator only applies to page-section links.

#### Acceptance Criteria

1. THE Active_Section_Tracker SHALL NOT apply the `is-active` class or `aria-current` attribute to the Download_Link.
2. WHEN any Section_Link is highlighted as active, THE Download_Link SHALL retain its accent-colour styling without change.

### Requirement 5: Accessibility

**User Story:** As a visitor using assistive technology, I want the Download CV link to be properly announced, so that I understand it triggers a file download rather than in-page navigation.

#### Acceptance Criteria

1. THE Download_Link in the Desktop_Nav SHALL have an `aria-label` attribute with the value "Download CV as PDF".
2. THE Download_Link in the Mobile_Menu SHALL have an `aria-label` attribute with the value "Download CV as PDF".
3. THE Download_Link SHALL meet the minimum touch-target size of 44 × 44 CSS pixels on viewports 768 px and narrower.

### Requirement 6: Responsive Visibility

**User Story:** As a visitor, I want the Download CV link to appear in the correct navigation context for my viewport, so that the experience is consistent with the other navigation links.

#### Acceptance Criteria

1. WHILE the viewport width is greater than 768 px, THE Download_Link in the Desktop_Nav SHALL be visible and THE Mobile_Menu SHALL be hidden.
2. WHILE the viewport width is 768 px or narrower, THE Desktop_Nav SHALL be hidden and THE Download_Link in the Mobile_Menu SHALL be accessible via the hamburger button.
