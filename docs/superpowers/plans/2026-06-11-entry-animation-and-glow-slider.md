# Entry Animation and Ambient Glow Slider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a sequential 3D "fanning-out" entry animation for the cards on startup, and add an ambient glow intensity slider in the settings panel to adjust background brightness.

**Architecture:** 
1. Use an `.intro` state class on `.coverflow-track` along with dynamic inline `transitionDelay` values to trigger a hardware-accelerated sequential fly-in animation from the 3D background depth.
2. Inject a new slider in the control panel UI to adjust `--glow-intensity` (bound to `#ambient-bg`'s opacity), enabling users to control background brightness.

**Tech Stack:** Vanilla HTML, CSS, JavaScript.

---

### Task 1: HTML Markup for Glow Slider & Intro State

**Files:**
- Modify: [index.html](file:///z:/VibeCoding/A/index.html)

- [ ] **Step 1: Add intro class to track container**
  Add the `intro` class to the track container around line 26:
  ```html
  <div class="coverflow-track intro" id="coverflow-track">
  ```

- [ ] **Step 2: Add the Ambient Glow control slider**
  Insert the Ambient Glow slider inside the "3D PROJECTION" settings section (around line 80, right after the Autoplay Delay slider group):
  ```html
                      <div class="slider-group">
                          <label for="slider-glow">Ambient Glow: <span id="val-glow">0.60</span></label>
                          <input type="range" id="slider-glow" min="0" max="1" step="0.05" value="0.60">
                      </div>
  ```

- [ ] **Step 3: Commit HTML changes**
  ```bash
  git add index.html
  git commit -m "feat: add ambient glow slider and intro class to index.html"
  ```

---

### Task 2: CSS Animations and Glow Opacity Rules

**Files:**
- Modify: [styles.css](file:///z:/VibeCoding/A/styles.css)

- [ ] **Step 1: Add intro state card transforms**
  Add the `.coverflow-track.intro .card` transform rules in `styles.css` (around line 117):
  ```css
  .coverflow-track.intro .card {
      transform: translate3d(0, 0, -800px) rotateY(0deg) scale(0.1) !important;
      opacity: 0 !important;
  }
  ```

- [ ] **Step 2: Initialize ambient-bg opacity styling**
  Add `opacity: 0.6;` as default to `.ambient-bg` styling (around line 30) and ensure it supports transition:
  ```css
  .ambient-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, #1b203a 0%, var(--bg-dark) 100%);
      transition: background 1.5s ease, opacity 0.4s ease;
      z-index: 1;
      opacity: 0.6; /* Default opacity */
  }
  ```

- [ ] **Step 3: Commit CSS changes**
  ```bash
  git add styles.css
  git commit -m "style: define CSS rules for card intro fly-in and default ambient-bg opacity"
  ```

---

### Task 3: JavaScript Implementation

**Files:**
- Modify: [app.js](file:///z:/VibeCoding/A/app.js)

- [ ] **Step 1: Cache new DOM elements and define paramGlow state**
  Add cached elements at the top of `app.js` and add `paramGlow` state variable:
  ```javascript
  let paramGlow = 0.60;

  // Cache slider glow elements
  const sliderGlow = document.getElementById('slider-glow');
  const valGlow = document.getElementById('val-glow');
  ```

- [ ] **Step 2: Bind Glow slider input listener**
  Add listener for `sliderGlow` (around line 515, where other sliders are bound) to update `paramGlow` and adjust `ambientBg` opacity:
  ```javascript
  sliderGlow.addEventListener('input', (e) => {
      paramGlow = parseFloat(e.target.value);
      valGlow.textContent = paramGlow.toFixed(2);
      ambientBg.style.opacity = paramGlow;
  });
  ```

- [ ] **Step 3: Apply fanning transition-delay inside `renderCards()`**
  Update `renderCards()` in `app.js` to assign a staggered `transitionDelay` to each card element, add the `intro` class to the track, and clear the delay after the animation completes.
  
  Code block inside `renderCards()`:
  ```javascript
  // Render Card Elements inside Track
  function renderCards() {
      track.innerHTML = '';
      track.classList.add('intro'); // Add intro class for page load animation
      
      cards.forEach((card, index) => {
          const cardEl = document.createElement('div');
          cardEl.className = 'card';
          cardEl.dataset.index = index;
          // Apply staggered transition delay for fanning effect
          cardEl.style.transitionDelay = `${index * 0.06}s`;

          cardEl.innerHTML = `
              <div class="card-inner">
                  <div class="card-front">
                      <img src="${escapeHTML(card.src)}" alt="${escapeHTML(card.title)}">
                      <div class="card-front-overlay">
                          <h3>${escapeHTML(card.title)}</h3>
                          <p>Click to view story</p>
                      </div>
                  </div>
              </div>
          `;

          // Click event to enter story mode or set active card
          cardEl.addEventListener('click', () => {
              if (isStoryMode) return;
              if (index === activeIndex) {
                  enterStoryMode();
              } else {
                  setActiveCard(index);
              }
          });

          track.appendChild(cardEl);
      });

      cardEls = document.querySelectorAll('.card');

      renderPagination();
      updateCoverflow();
      updateDecorations();

      // Trigger the fly-in animation by removing intro class in the next frames
      setTimeout(() => {
          track.classList.remove('intro');
          
          // Clear transition delay after animation finishes so drag/swipes are instant
          setTimeout(() => {
              cardEls.forEach(cardEl => {
                  cardEl.style.transitionDelay = '';
              });
          }, cards.length * 60 + 650); // duration of staggered delay + transition duration
      }, 50);
  }
  ```

- [ ] **Step 4: Update `updateAmbientBg()` to respect the custom glow intensity**
  Update `updateAmbientBg()` to apply `paramGlow` directly to the `opacity` style:
  ```javascript
  // Update Ambient lighting based on current active card theme color
  function updateAmbientBg() {
      if (cards[activeIndex]) {
          const color = cards[activeIndex].color || '#1b203a';
          ambientBg.style.background = `radial-gradient(circle at center, ${color} 0%, var(--bg-dark) 100%)`;
          ambientBg.style.opacity = paramGlow;
      }
  }
  ```

- [ ] **Step 5: Verify animation and slider work correctly**
  Refresh the preview page and check the sequential fan-out animation. Open the settings drawer, drag the Ambient Glow slider, and verify the background opacity adjusts.

- [ ] **Step 6: Commit script changes**
  ```bash
  git add app.js
  git commit -m "feat: implement sequential card entry animation and dynamic ambient glow slider control"
  ```
