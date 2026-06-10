# Spec: Immersive Gallery Decorative Margins Design

This specification defines the additions and styles required to implement Option B (Artistic Margins & Viewfinder Details) on the Immersive 3D Cover Flow Gallery. This addresses visual emptiness in full-screen desktop resolutions by wrapping the central stage in clean, exhibition-style lines and typography details.

## Visual Components

### 1. Viewport Gridlines
- Two thin vertical lines at `left: 8%` and `right: 8%` (or fixed `120px` margins depending on screen width).
- Style: `1px solid rgba(255, 255, 255, 0.05)`.
- Fades out in `.story-mode`.

### 2. Branding Typography (Left Margin)
- Text content: `EXHIBITION 2026 // IMMERSIVE GALLERY`
- Layout: Positioned vertically on the left margin, rotated by `-90deg` or `-180deg` via `writing-mode: vertical-lr`.
- Typography: Outfit font, `letter-spacing: 0.3em`, `font-size: 0.65rem`, color `rgba(240, 240, 245, 0.3)`.
- Fades out in `.story-mode`.

### 3. Dynamic Card Index Counter (Right Margin)
- Layout: Positioned on the right margin, centering three blocks vertically:
  - Label: `"INDEX"` (Outfit font, small capitalization)
  - Active index value (styled in large accent color, e.g., `"03"`)
  - Divider: `"—"`
  - Total cards count (styled in standard dim color, e.g., `"05"`)
- Updates dynamically in JavaScript whenever the active index shifts.
- Fades out in `.story-mode`.

### 4. Minimalist Camera Viewfinder Corners
- Layout: Positioned at the margins of the central 3D Cover Flow viewport (inside the grid boundaries).
- Style: Small lines (`15px * 15px`) representing borders:
  - Top-left: `border-left` and `border-top`
  - Top-right: `border-right` and `border-top`
  - Bottom-left: `border-left` and `border-bottom`
  - Bottom-right: `border-right` and `border-bottom`
- Border color: `rgba(255, 255, 255, 0.15)`.
- Fades out in `.story-mode`.

---

## Code Changes

### [index.html](file:///z:/VibeCoding/A/index.html)
- Add elements for the left vertical text container, right counter container, and corner viewfinder brackets inside the `.app-container` wrapper.

### [styles.css](file:///z:/VibeCoding/A/styles.css)
- Implement CSS classes for vertical layout gridlines, text rotation, active index styling, viewfinder corner layout, and responsive visibility (e.g. hides or shrinks on mobile viewports below `768px`).
- Include rules to set `opacity: 0` and `pointer-events: none` on these elements when `.app-container` has the `.story-mode` class.

### [app.js](file:///z:/VibeCoding/A/app.js)
- Cache DOM elements: `#decor-active-index` and `#decor-total-count`.
- Update the display text in a new helper `updateDecorations()` called during `renderCards()` and `setActiveCard()`.
- Populate `#decor-total-count` with `cards.length` (padded to two digits).
- Populate `#decor-active-index` with `activeIndex + 1` (padded to two digits).

---

## Verification Plan
1. **Visual Balance**: Verify that the viewport feels structured and premium on widescreen displays.
2. **Dynamic Binding**: Shift cards using swiping, wheel, and navigation buttons; verify that the index indicator updates synchronously (e.g., changes from `01` to `02`).
3. **Transition Cleanup**: Click the active card to enter story mode; verify that the text, indicators, grid lines, and corners fade out completely along with the header and footer.
4. **Custom Card Addition**: Add a custom photo; verify that the total cards count updates (e.g., from `05` to `06`).
