# Immersive Gallery Viewport Decorations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add vertical gridlines, vertical branding text, dynamic active-card counters, and viewport viewfinder corners to the main gallery to fill visual emptiness on desktop resolutions.

**Architecture:** Integrate decorative DOM elements inside the main application wrapper, apply glassmorphic thin-border CSS styling that fades out in story mode, and dynamically sync the counter values via the active index setter in JavaScript.

**Tech Stack:** Vanilla HTML, CSS, JavaScript (No external libraries).

---

### Task 1: Add HTML Markup

**Files:**
- Modify: [index.html](file:///z:/VibeCoding/A/index.html)

- [ ] **Step 1: Insert markup for the margins, lines, counter, and brackets**
  Insert the decoration markup right after `<div class="app-container">` (line 17) to ensure they are layered correctly as direct children.
  
  Code to insert:
  ```html
        <!-- Viewport Gridlines and Margins (Option B) -->
        <div class="viewport-decor viewport-gridline left-gridline"></div>
        <div class="viewport-decor viewport-gridline right-gridline"></div>

        <div class="viewport-decor margin-branding-left">
            <span>EXHIBITION 2026 // IMMERSIVE GALLERY</span>
        </div>

        <div class="viewport-decor margin-counter-right">
            <span class="decor-label">INDEX</span>
            <span id="decor-active-index" class="decor-active-value">03</span>
            <span class="decor-divider">—</span>
            <span id="decor-total-count" class="decor-total-value">05</span>
        </div>

        <div class="viewport-decor viewfinder-corners">
            <div class="corner-bracket top-left"></div>
            <div class="corner-bracket top-right"></div>
            <div class="corner-bracket bottom-left"></div>
            <div class="corner-bracket bottom-right"></div>
        </div>
  ```

- [ ] **Step 2: Verify the index.html loads on the local server without syntax errors**
  Open the page `http://localhost:8080` in the browser or check terminal console output to make sure it loads. (The styles are not yet applied so elements will look unstyled at the bottom or corners).

- [ ] **Step 3: Commit markup changes**
  ```bash
  git add index.html
  git commit -m "feat: add decoration elements to index.html"
  ```

---

### Task 2: Style Margins & Viewfinder

**Files:**
- Modify: [styles.css](file:///z:/VibeCoding/A/styles.css)

- [ ] **Step 1: Append styling rules for gridlines, rotated branding text, and brackets**
  Append the following CSS rules at the bottom of `styles.css`:
  
  ```css
  /* Viewport gridlines and margin elements */
  .viewport-decor {
      position: absolute;
      pointer-events: none;
      z-index: 2;
      transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1), 
                  transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .viewport-gridline {
      top: 0;
      bottom: 0;
      width: 1px;
      background: rgba(255, 255, 255, 0.05);
  }

  .left-gridline {
      left: 120px;
  }

  .right-gridline {
      right: 120px;
  }

  .margin-branding-left {
      left: 30px;
      top: 50%;
      transform: translateY(-50%) rotate(-180deg);
      writing-mode: vertical-lr;
      font-size: 0.65rem;
      letter-spacing: 0.4em;
      color: rgba(240, 240, 245, 0.25);
      font-weight: 400;
      text-transform: uppercase;
      white-space: nowrap;
  }

  .margin-counter-right {
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 4px;
      font-family: 'Outfit', monospace;
  }

  .decor-label {
      font-size: 0.6rem;
      letter-spacing: 0.15em;
      color: rgba(240, 240, 245, 0.3);
      text-transform: uppercase;
      font-weight: 600;
  }

  .decor-active-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent);
      text-shadow: 0 0 12px rgba(161, 196, 253, 0.3);
      line-height: 1;
      margin: 2px 0;
  }

  .decor-divider {
      font-size: 0.75rem;
      color: rgba(240, 240, 245, 0.2);
  }

  .decor-total-value {
      font-size: 0.75rem;
      color: rgba(240, 240, 245, 0.4);
      font-weight: 400;
  }

  /* Viewfinder camera bracket overlay */
  .viewfinder-corners {
      top: 15vh;
      bottom: 15vh;
      left: 140px;
      right: 140px;
  }

  .corner-bracket {
      position: absolute;
      width: 16px;
      height: 16px;
      border: 1.5px solid transparent;
  }

  .corner-bracket.top-left {
      top: 0;
      left: 0;
      border-left-color: rgba(255, 255, 255, 0.12);
      border-top-color: rgba(255, 255, 255, 0.12);
  }

  .corner-bracket.top-right {
      top: 0;
      right: 0;
      border-right-color: rgba(255, 255, 255, 0.12);
      border-top-color: rgba(255, 255, 255, 0.12);
  }

  .corner-bracket.bottom-left {
      bottom: 0;
      left: 0;
      border-left-color: rgba(255, 255, 255, 0.12);
      border-bottom-color: rgba(255, 255, 255, 0.12);
  }

  .corner-bracket.bottom-right {
      bottom: 0;
      right: 0;
      border-right-color: rgba(255, 255, 255, 0.12);
      border-bottom-color: rgba(255, 255, 255, 0.12);
  }

  /* Hide decorations when reading story mode */
  .app-container.story-mode .viewport-decor {
      opacity: 0 !important;
      pointer-events: none !important;
  }

  /* Mobile Responsive adjustments - hide side items */
  @media (max-width: 900px) {
      .viewport-gridline,
      .margin-branding-left,
      .margin-counter-right,
      .viewfinder-corners {
          display: none !important;
      }
  }
  ```

- [ ] **Step 2: Append story-mode transform transition styling if needed**
  Ensure that `.viewport-decor` transitions smoothly. Since we already set `.viewport-decor { transition: opacity ... }` and `.app-container.story-mode .viewport-decor { opacity: 0 }`, the elements will fade out elegantly.

- [ ] **Step 3: Verify style updates look aligned and hide correctly in story mode**
  Open the page, click a card to check that background decorations fade away.

- [ ] **Step 4: Commit stylesheet changes**
  ```bash
  git add styles.css
  git commit -m "style: add viewport margin decoration rules"
  ```

---

### Task 3: Implement Dynamic Counter Updates

**Files:**
- Modify: [app.js](file:///z:/VibeCoding/A/app.js)

- [ ] **Step 1: Cache index counter DOM elements**
  Add cached elements at the top section where Story Mode Elements are cached:
  ```javascript
  const decorActiveIndex = document.getElementById('decor-active-index');
  const decorTotalCount = document.getElementById('decor-total-count');
  ```

- [ ] **Step 2: Add dynamic updates helper function**
  Add `updateDecorations()` helper below `updateAmbientBg()` in `app.js`:
  ```javascript
  // Update left/right margin dynamic indicator elements
  function updateDecorations() {
      if (decorActiveIndex && decorTotalCount) {
          decorActiveIndex.textContent = String(activeIndex + 1).padStart(2, '0');
          decorTotalCount.textContent = String(cards.length).padStart(2, '0');
      }
  }
  ```

- [ ] **Step 3: Call `updateDecorations()` in cards rendering and shifting**
  - Call `updateDecorations()` at the end of `renderCards()`.
  - Call `updateDecorations()` inside `setActiveCard()`.
  
  In `renderCards()` (inside `app.js`):
  ```javascript
      cardEls = document.querySelectorAll('.card');

      renderPagination();
      updateCoverflow();
      updateDecorations();
  ```
  
  In `setActiveCard()` (inside `app.js`):
  ```javascript
          dotEls.forEach((dot, idx) => {
              if (idx === activeIndex) dot.classList.add('active');
              else dot.classList.remove('active');
          });

          updateCoverflow();
          updateDecorations();
  ```

- [ ] **Step 4: Verify counter works**
  Verify that scrolling/navigating the cards dynamically changes the right margin counter (e.g. from `03` to `04` out of `05`). Verify adding a custom card updates the total count to `06`.

- [ ] **Step 5: Commit script changes**
  ```bash
  git add app.js
  git commit -m "feat: bind dynamic active-card index decorations in app.js"
  ```
