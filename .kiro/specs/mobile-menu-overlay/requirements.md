# Requirements Document

## Introduction

The mobile navigation menu on Faiz Mazlan's portfolio website currently uses a solid background (`var(--color-bg-primary)`) that fully covers the page content when opened. This feature replaces the solid background with a semi-transparent overlay so that page content remains partially visible behind the menu links. The overlay must work correctly in both light and dark themes, and the menu links must remain clearly readable against the translucent backdrop.

## Glossary

- **Mobile_Menu**: The full-screen fixed-position navigation overlay (`.mobile-menu`, `#mobile-menu`) displayed on viewports ≤ 768 px when the hamburger button is activated.
- **Overlay_Background**: The background layer of the Mobile_Menu that sits between the page content and the menu links.
- **Menu_Link**: An individual navigation anchor (`.mobile-menu__link`) rendered inside the Mobile_Menu.
- **Light_Theme**: The default color scheme where `--color-bg-primary` is `#FFFFFF`.
- **Dark_Theme**: The alternate color scheme (`[data-theme="dark"]`) where `--color-bg-primary` is `#000000`.
- **Backdrop_Blur**: A CSS `backdrop-filter: blur()` effect applied to the Overlay_Background to soften the page content visible behind the overlay and improve text legibility.

## Requirements

### Requirement 1: Semi-Transparent Overlay Background

**User Story:** As a site visitor on a mobile device, I want the mobile menu to use a semi-transparent background, so that I can see the page content behind the menu while navigating.

#### Acceptance Criteria

1. WHEN the Mobile_Menu is opened, THE Overlay_Background SHALL render with a semi-transparent color that allows the underlying page content to be partially visible.
2. THE Overlay_Background SHALL use an opacity level between 0.85 and 0.95 (inclusive) so that page content is visible but does not compete with Menu_Link readability.
3. WHEN the Mobile_Menu open/close transition plays, THE Overlay_Background SHALL transition smoothly using the existing opacity and visibility transition timing.

### Requirement 2: Backdrop Blur Effect

**User Story:** As a site visitor, I want the overlay to apply a blur effect to the content behind it, so that the menu links are easy to read without the background being fully opaque.

#### Acceptance Criteria

1. WHILE the Mobile_Menu is open, THE Overlay_Background SHALL apply a Backdrop_Blur effect to the page content visible behind the overlay.
2. THE Backdrop_Blur SHALL use a blur radius sufficient to soften background content without making it completely unrecognizable (between 10 px and 30 px inclusive).

### Requirement 3: Theme Compatibility

**User Story:** As a site visitor, I want the transparent overlay to look correct in both light and dark themes, so that the menu is always readable regardless of my theme preference.

#### Acceptance Criteria

1. WHILE the Light_Theme is active, THE Overlay_Background SHALL use a semi-transparent white-based color.
2. WHILE the Dark_Theme is active, THE Overlay_Background SHALL use a semi-transparent black-based color.
3. THE Menu_Link text SHALL maintain a contrast ratio of at least 4.5:1 against the Overlay_Background in both Light_Theme and Dark_Theme.

### Requirement 4: Menu Link Readability

**User Story:** As a site visitor, I want the menu links to remain clearly visible and readable over the transparent overlay, so that I can navigate the site without difficulty.

#### Acceptance Criteria

1. THE Menu_Link SHALL retain its existing font size, font weight, and color values so that readability is not degraded by the overlay change.
2. WHEN a user hovers or focuses on a Menu_Link, THE Menu_Link SHALL continue to display the accent color hover/focus state.
3. THE Menu_Link staggered entrance animation SHALL continue to function without visual artifacts when rendered over the semi-transparent Overlay_Background.

### Requirement 5: Existing Functionality Preservation

**User Story:** As a site visitor, I want all existing mobile menu behaviors to continue working after the overlay change, so that navigation remains fully functional.

#### Acceptance Criteria

1. WHEN the hamburger button is activated, THE Mobile_Menu SHALL open with the same opacity/visibility transition as before the overlay change.
2. WHEN a Menu_Link is clicked, THE Mobile_Menu SHALL close and scroll to the target section.
3. WHEN the Escape key is pressed while the Mobile_Menu is open, THE Mobile_Menu SHALL close and return focus to the previously focused element.
4. WHILE the Mobile_Menu is open, THE Mobile_Menu SHALL trap keyboard focus within the menu and hamburger button.
5. THE Mobile_Menu SHALL continue to use `position: fixed` with `inset: 0` to cover the full viewport.
