# Tasks

- [x] 1. Add overlay CSS custom properties to variables.css
  - [x] 1.1 Add `--color-overlay-bg: rgba(255, 255, 255, 0.88)` to the `:root` block in `css/variables.css`
  - [x] 1.2 Add `--color-overlay-bg: rgba(0, 0, 0, 0.88)` to the `[data-theme="dark"]` block in `css/variables.css`
- [x] 2. Update mobile menu background and add backdrop blur in components.css
  - [x] 2.1 Replace `background: var(--color-bg-primary)` with `background: var(--color-overlay-bg)` in the `.mobile-menu` rule in `css/components.css`
  - [x] 2.2 Add `backdrop-filter: blur(20px)` and `-webkit-backdrop-filter: blur(20px)` to the `.mobile-menu` rule in `css/components.css`
- [x] 3. Verify the build succeeds and output is correct
  - [x] 3.1 Run `npm run build` and confirm it completes without errors
  - [x] 3.2 Verify the built output in `dist/` contains the updated CSS with `--color-overlay-bg` and `backdrop-filter`
