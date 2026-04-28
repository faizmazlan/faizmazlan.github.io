# Requirements Document

## Introduction

Update the certifications section of the portfolio website to display the correct 6 certifications from the CV PDF (replacing the current incorrect 4), and add a carousel/slider interaction that allows users to browse through certification badges on both desktop and mobile devices. The carousel should integrate seamlessly with the existing vanilla HTML/CSS/JS stack and BEM naming conventions.

## Glossary

- **Carousel**: A UI component that displays items in a horizontally scrollable track with navigation controls, showing a subset of items at a time
- **Carousel_Track**: The scrollable container that holds all certification badge slides
- **Carousel_Slide**: An individual item within the carousel track containing one certification badge
- **Navigation_Arrow**: A clickable button (previous/next) that advances the carousel by one slide
- **Pagination_Indicator**: A set of dots or markers showing the current position within the carousel
- **Portfolio_Website**: The vanilla HTML/CSS/JS single-page portfolio site at index.html
- **Certifications_Section**: The section of the portfolio displaying professional certification badges

## Requirements

### Requirement 1: Display Correct Certifications

**User Story:** As a portfolio visitor, I want to see the correct and up-to-date certifications, so that I can verify the site owner's actual qualifications.

#### Acceptance Criteria

1. THE Certifications_Section SHALL display exactly 6 certification badges with the following data:
   - "Microsoft Certified: Microsoft Azure Architect Technologies" — Feb 2021
   - "Microsoft Certified: Azure Administrator Associate" — Jan 2020
   - "Microsoft Certified: Azure Fundamentals" — Aug 2022
   - "Microsoft OpenHack: DevOps" — May 2022
   - "Microsoft OpenHack: Serverless" — Nov 2022
   - "Scrum.org: Professional Scrum Master I (PSM I)" — Aug 2024
2. THE Certifications_Section SHALL remove all previously incorrect certification entries (AWS Certified Solutions Architect, AWS Certified SysOps Administrator, incorrect dates)
3. WHEN the page loads, THE Certifications_Section SHALL render each badge with an icon, certification name, and date

### Requirement 2: Carousel Layout and Structure

**User Story:** As a portfolio visitor, I want the certifications displayed in a carousel format, so that I can browse through them without the section taking up excessive vertical space.

#### Acceptance Criteria

1. THE Carousel SHALL contain a horizontal track that holds all 6 certification badges as individual slides
2. THE Carousel SHALL display a subset of visible slides based on viewport width (multiple on desktop, fewer on tablet, one on mobile)
3. THE Carousel SHALL include previous and next Navigation_Arrow buttons positioned on either side of the track
4. THE Carousel SHALL include a Pagination_Indicator below the track showing the current position
5. THE Carousel SHALL use the existing BEM naming convention with the `certifications__` prefix for all new elements

### Requirement 3: Carousel Navigation via Arrows

**User Story:** As a portfolio visitor, I want to click arrow buttons to move between certifications, so that I can browse them at my own pace.

#### Acceptance Criteria

1. WHEN the next Navigation_Arrow is clicked, THE Carousel SHALL advance the track by one slide to the right
2. WHEN the previous Navigation_Arrow is clicked, THE Carousel SHALL move the track by one slide to the left
3. WHEN the Carousel reaches the last slide, THE next Navigation_Arrow SHALL become visually disabled and non-interactive
4. WHEN the Carousel is at the first slide, THE previous Navigation_Arrow SHALL become visually disabled and non-interactive
5. THE Navigation_Arrow buttons SHALL have a minimum touch target size of 44×44 pixels

### Requirement 4: Carousel Pagination Indicators

**User Story:** As a portfolio visitor, I want to see dot indicators showing my position in the carousel, so that I know how many certifications exist and which one I am viewing.

#### Acceptance Criteria

1. THE Pagination_Indicator SHALL display one dot for each navigable position in the carousel
2. WHEN the carousel position changes, THE Pagination_Indicator SHALL update the active dot to reflect the current position
3. WHEN a Pagination_Indicator dot is clicked, THE Carousel SHALL navigate to the corresponding position
4. THE active dot SHALL be visually distinct from inactive dots using the accent color (--color-accent)

### Requirement 5: Touch and Swipe Support

**User Story:** As a mobile user, I want to swipe through certifications with my finger, so that I can browse them naturally on a touchscreen.

#### Acceptance Criteria

1. WHEN a horizontal swipe gesture is detected on the Carousel_Track, THE Carousel SHALL advance or retreat by one slide in the swipe direction
2. THE Carousel SHALL distinguish horizontal swipes from vertical page scrolling (minimum horizontal threshold of 30px with vertical movement less than horizontal)
3. WHILE a touch drag is in progress, THE Carousel_Track SHALL follow the finger position to provide visual feedback

### Requirement 6: Responsive Behavior

**User Story:** As a portfolio visitor on any device, I want the carousel to adapt to my screen size, so that it looks good and functions well regardless of viewport width.

#### Acceptance Criteria

1. WHILE the viewport width is greater than 1024px, THE Carousel SHALL display 3 slides simultaneously
2. WHILE the viewport width is between 769px and 1024px, THE Carousel SHALL display 2 slides simultaneously
3. WHILE the viewport width is 768px or less, THE Carousel SHALL display 1 slide at a time
4. WHEN the viewport is resized, THE Carousel SHALL recalculate visible slides and adjust its layout without requiring a page reload

### Requirement 7: Accessibility

**User Story:** As a visitor using assistive technology, I want the carousel to be fully accessible, so that I can navigate certifications using a keyboard or screen reader.

#### Acceptance Criteria

1. THE Carousel SHALL have an appropriate ARIA role and label (aria-roledescription="carousel", aria-label="Certifications")
2. THE Navigation_Arrow buttons SHALL have descriptive aria-label attributes ("Previous certification", "Next certification")
3. WHEN a Navigation_Arrow is disabled, THE button SHALL have aria-disabled="true"
4. THE Carousel_Track SHALL use aria-live="polite" to announce slide changes to screen readers
5. WHEN the left or right arrow key is pressed while focus is within the Carousel, THE Carousel SHALL navigate to the previous or next slide respectively

### Requirement 8: Animation and Transitions

**User Story:** As a portfolio visitor, I want smooth transitions when browsing certifications, so that the interaction feels polished and professional.

#### Acceptance Criteria

1. WHEN the carousel navigates between slides, THE Carousel_Track SHALL animate the transition using a CSS transform with the project's easing variable (--ease-out-quart) and duration (--duration-normal, 400ms)
2. THE Carousel SHALL use CSS transforms (translateX) for slide movement to ensure GPU-accelerated rendering
3. WHILE a transition is in progress, THE Navigation_Arrow buttons SHALL ignore additional clicks until the transition completes

### Requirement 9: Carousel Module Integration

**User Story:** As a developer, I want the carousel logic in a dedicated ES module, so that it follows the project's existing code organization pattern.

#### Acceptance Criteria

1. THE carousel logic SHALL be implemented in a new ES module file (js/carousel.js)
2. THE carousel module SHALL export an initialization function following the same pattern as other modules (initCarousel)
3. WHEN the application initializes, THE app.js module SHALL import and call initCarousel alongside existing module initializations
