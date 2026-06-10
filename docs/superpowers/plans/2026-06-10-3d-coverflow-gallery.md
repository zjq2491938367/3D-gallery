# 3D Cover Flow Immersive Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-end, fullscreen interactive 3D Cover Flow photography gallery using native HTML, CSS, and JavaScript.

**Architecture:** Use CSS 3D transforms (`perspective`, `rotateY`, `translate3d`) mapped dynamically via JS math projections to calculate card spacing, depth, and angles. Implement custom event listeners for mouse/touch dragging with inertia, autoplay, dynamic ambient background lighting, 3D hover tilt, card flipping, and a settings/upload panel.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+).

---

### Task 1: Basic Project Setup and HTML Layout

**Files:**
- Create: `index.html`

- [ ] **Step 1: Write HTML Structure**
  Create the basic document structure including all layouts for the fullscreen gallery, ambient background, control drawer, and setting sliders.

  Write code to `index.html`:
  ```html
  <!DOCTYPE html>
  <html lang="zh-CN">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>3D Cover Flow Immersive Gallery</title>
      <link rel="stylesheet" href="styles.css">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
      <!-- Dynamic Ambient Glow Background -->
      <div id="ambient-bg" class="ambient-bg"></div>

      <!-- App Wrapper -->
      <div class="app-container">
          <!-- Header Logo / Title -->
          <header class="gallery-header">
              <h1>IMMERSIVE GALLERY</h1>
              <p class="tagline">3D COVER FLOW EXHIBITION</p>
          </header>

          <!-- 3D Cover Flow Container -->
          <main class="coverflow-container" id="coverflow-container">
              <div class="coverflow-track" id="coverflow-track">
                  <!-- Cards will be dynamically rendered here -->
              </div>
          </main>

          <!-- Bottom Control Bar -->
          <footer class="gallery-footer">
              <div class="navigation-controls">
                  <button id="btn-prev" class="nav-btn" aria-label="Previous image">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button id="btn-play" class="nav-btn play-btn" aria-label="Toggle autoplay">
                      <svg id="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      <svg id="pause-icon" class="hidden" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                  </button>
                  <button id="btn-next" class="nav-btn" aria-label="Next image">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
              </div>
              <div class="pagination" id="pagination">
                  <!-- Indicators will be dynamically rendered here -->
              </div>
          </footer>

          <!-- Sidebar Settings Drawer Toggle Button -->
          <button id="btn-toggle-panel" class="panel-toggle" aria-label="Open settings panel">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>

          <!-- Glassmorphism Settings Panel -->
          <aside id="control-panel" class="control-panel">
              <div class="panel-header">
                  <h2>GALLERY SETTINGS</h2>
                  <button id="btn-close-panel" class="close-btn">&times;</button>
              </div>
              <div class="panel-content">
                  <!-- Section 1: 3D Projection Adjustment -->
                  <div class="settings-section">
                      <h3>3D PROJECTION</h3>
                      <div class="slider-group">
                          <label for="slider-spacing">Card Spacing: <span id="val-spacing">100</span>px</label>
                          <input type="range" id="slider-spacing" min="50" max="250" value="100">
                      </div>
                      <div class="slider-group">
                          <label for="slider-angle">Rotation Angle: <span id="val-angle">60</span>°</label>
                          <input type="range" id="slider-angle" min="20" max="85" value="60">
                      </div>
                      <div class="slider-group">
                          <label for="slider-depth">Z-Depth Offset: <span id="val-depth">180</span>px</label>
                          <input type="range" id="slider-depth" min="50" max="300" value="180">
                      </div>
                      <div class="slider-group">
                          <label for="slider-autoplay">Autoplay Delay: <span id="val-autoplay">3.5</span>s</label>
                          <input type="range" id="slider-autoplay" min="1" max="10" step="0.5" value="3.5">
                      </div>
                  </div>

                  <!-- Section 2: Upload / Manage Images -->
                  <div class="settings-section">
                      <h3>ADD CUSTOM IMAGES</h3>
                      
                      <!-- Tab selector for File or URL -->
                      <div class="add-methods">
                          <button id="method-file" class="method-tab active">Local File</button>
                          <button id="method-url" class="method-tab">Image URL</button>
                      </div>

                      <!-- Local File drag and drop -->
                      <div id="file-upload-container" class="upload-zone">
                          <input type="file" id="file-input" accept="image/*" class="hidden-input">
                          <div class="drag-message">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                              <p>Drag & drop image here or <span class="highlight">Browse</span></p>
                          </div>
                      </div>

                      <!-- URL Input form -->
                      <form id="url-upload-form" class="url-form hidden">
                          <input type="url" id="url-input" placeholder="https://example.com/photo.jpg" required>
                          <input type="text" id="title-input" placeholder="Image Title (Optional)">
                          <button type="submit" class="submit-btn">Add Image</button>
                      </form>
                  </div>

                  <!-- Section 3: Manage Image List -->
                  <div class="settings-section">
                      <h3>MANAGE IMAGES</h3>
                      <ul id="image-list" class="image-list">
                          <!-- List items populated dynamically -->
                      </ul>
                  </div>
              </div>
          </aside>
      </div>
      <script src="app.js"></script>
  </body>
  </html>
  ```

- [ ] **Step 2: Commit setup**
  Commit the initial HTML file to git.
  ```bash
  git add index.html
  git commit -m "setup: create initial HTML markup structure"
  ```

---

### Task 2: CSS Stylesheet Implementation

**Files:**
- Create: `styles.css`

- [ ] **Step 1: Write styles.css file**
  Implement typography, custom dark-themed background gradients, glassmorphism, 3D rotations, perspective variables, reflection filters, and keyframe definitions.

  Write content to `styles.css`:
  ```css
  :root {
      --font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --bg-dark: #07070a;
      --text-main: #f0f0f5;
      --text-dim: rgba(240, 240, 245, 0.6);
      --accent: #a1c4fd;
      --glass-bg: rgba(10, 10, 15, 0.5);
      --glass-border: rgba(255, 255, 255, 0.08);
      --panel-width: 380px;
  }

  * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
  }

  body {
      font-family: var(--font-family);
      background-color: var(--bg-dark);
      color: var(--text-main);
      min-height: 100vh;
      overflow: hidden;
      position: relative;
  }

  /* Dynamic Ambient Background Glow */
  .ambient-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, #1b203a 0%, var(--bg-dark) 100%);
      transition: background 1.5s ease;
      z-index: 1;
  }

  /* Main Container */
  .app-container {
      position: relative;
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      z-index: 2;
      padding: 30px;
  }

  /* Header */
  .gallery-header {
      text-align: center;
      margin-top: 10px;
  }

  .gallery-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: 0.3em;
      background: linear-gradient(135deg, #ffffff 30%, var(--accent) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 4px 20px rgba(161, 196, 253, 0.1);
  }

  .gallery-header .tagline {
      font-size: 0.75rem;
      letter-spacing: 0.5em;
      color: var(--text-dim);
      margin-top: 6px;
      font-weight: 300;
  }

  /* 3D Cover Flow Viewport */
  .coverflow-container {
      width: 100%;
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1000px;
      perspective-origin: 50% 45%;
      overflow: visible;
      position: relative;
  }

  .coverflow-track {
      position: relative;
      width: 320px;
      height: 440px;
      transform-style: preserve-3d;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      user-select: none;
  }

  .coverflow-track:active {
      cursor: grabbing;
  }

  /* Interactive Cards */
  .card {
      position: absolute;
      width: 290px;
      height: 380px;
      transform-style: preserve-3d;
      transition: transform 0.65s cubic-bezier(0.2, 0.85, 0.25, 1), 
                  opacity 0.65s cubic-bezier(0.2, 0.85, 0.25, 1), 
                  filter 0.65s cubic-bezier(0.2, 0.85, 0.25, 1);
      will-change: transform, opacity, filter;
      border-radius: 16px;
  }

  /* Card Reflection Effect */
  .card::after {
      content: "";
      position: absolute;
      top: 102%;
      left: 0;
      width: 100%;
      height: 80px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, transparent 100%);
      pointer-events: none;
      border-radius: 0 0 16px 16px;
      filter: blur(2px);
      opacity: 0;
      transition: opacity 0.5s ease;
  }

  .card.active::after {
      opacity: 0.25;
  }

  .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  }

  .card.flipped .card-inner {
      transform: rotateY(180deg);
  }

  /* Card Front and Back Faces */
  .card-front, .card-back {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      backface-visibility: hidden;
      overflow: hidden;
  }

  .card-front {
      border: 1px solid rgba(255, 255, 255, 0.15);
  }

  .card-front img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      pointer-events: none;
  }

  .card-front-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 24px;
      opacity: 0;
      transition: opacity 0.4s ease;
  }

  .card.active .card-front-overlay {
      opacity: 1;
  }

  .card-front-overlay h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
  }

  .card-front-overlay p {
      font-size: 0.8rem;
      color: var(--text-dim);
  }

  .card-back {
      background: rgba(10, 10, 15, 0.9);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transform: rotateY(180deg);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 30px;
      text-align: center;
      color: var(--text-main);
  }

  .card-back h3 {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 12px;
      color: var(--accent);
      letter-spacing: 0.1em;
  }

  .card-back p {
      font-size: 0.9rem;
      line-height: 1.6;
      color: var(--text-dim);
      margin-bottom: 24px;
  }

  .btn-flip-back {
      padding: 8px 18px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      color: #fff;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: var(--font-family);
      letter-spacing: 0.1em;
  }

  .btn-flip-back:hover {
      background: #fff;
      color: var(--bg-dark);
      border-color: #fff;
  }

  /* Controls and Footer Area */
  .gallery-footer {
      width: 100%;
      max-width: 600px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      margin-bottom: 15px;
  }

  .navigation-controls {
      display: flex;
      align-items: center;
      gap: 20px;
  }

  .nav-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
  }

  .nav-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
  }

  .play-btn {
      width: 50px;
      height: 50px;
      background: var(--accent);
      color: var(--bg-dark);
      border: none;
  }

  .play-btn:hover {
      background: #fff;
      transform: scale(1.08);
  }

  .pagination {
      display: flex;
      gap: 8px;
      height: 20px;
      align-items: center;
  }

  .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.4s ease;
  }

  .dot.active {
      width: 24px;
      border-radius: 3px;
      background: var(--accent);
      box-shadow: 0 0 10px rgba(161, 196, 253, 0.5);
  }

  /* Settings Panel Drawer */
  .panel-toggle {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 5;
  }

  .panel-toggle:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.3);
      transform: rotate(30deg);
  }

  .control-panel {
      position: fixed;
      top: 0;
      right: calc(-1 * var(--panel-width));
      width: var(--panel-width);
      height: 100vh;
      background: rgba(10, 10, 15, 0.75);
      backdrop-filter: blur(30px);
      -webkit-backdrop-filter: blur(30px);
      border-left: 1px solid var(--glass-border);
      box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      transition: right 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      z-index: 10;
  }

  .control-panel.open {
      right: 0;
  }

  .panel-header {
      padding: 30px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .panel-header h2 {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.15em;
  }

  .close-btn {
      background: none;
      border: none;
      color: var(--text-dim);
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
  }

  .close-btn:hover {
      color: #fff;
  }

  .panel-content {
      padding: 30px;
      overflow-y: auto;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 30px;
  }

  .settings-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
  }

  .settings-section h3 {
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      color: var(--accent);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 8px;
  }

  .slider-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.85rem;
  }

  .slider-group label {
      display: flex;
      justify-content: space-between;
      color: var(--text-dim);
  }

  .slider-group input[type="range"] {
      width: 100%;
      height: 4px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
      outline: none;
      -webkit-appearance: none;
  }

  .slider-group input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--accent);
      cursor: pointer;
      box-shadow: 0 0 6px var(--accent);
  }

  /* Add Image forms styling */
  .add-methods {
      display: flex;
      border: 1px solid var(--glass-border);
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 10px;
  }

  .method-tab {
      flex: 1;
      padding: 8px 0;
      background: none;
      border: none;
      color: var(--text-dim);
      font-family: var(--font-family);
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.3s ease;
  }

  .method-tab.active {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
  }

  .upload-zone {
      border: 1.5px dashed rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
  }

  .upload-zone:hover, .upload-zone.dragover {
      border-color: var(--accent);
      background: rgba(161, 196, 253, 0.05);
  }

  .drag-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: var(--text-dim);
      font-size: 0.8rem;
  }

  .drag-message svg {
      color: var(--accent);
  }

  .highlight {
      color: var(--accent);
      text-decoration: underline;
  }

  .url-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
  }

  .url-form input {
      width: 100%;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      color: #fff;
      font-family: var(--font-family);
      font-size: 0.85rem;
      outline: none;
  }

  .url-form input:focus {
      border-color: var(--accent);
  }

  .submit-btn {
      width: 100%;
      padding: 10px;
      background: var(--accent);
      border: none;
      border-radius: 8px;
      color: var(--bg-dark);
      font-weight: 600;
      font-family: var(--font-family);
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s ease;
  }

  .submit-btn:hover {
      background: #fff;
      transform: translateY(-1px);
  }

  .image-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-height: 250px;
      overflow-y: auto;
      padding-right: 5px;
  }

  .image-item {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      padding: 6px 12px;
  }

  .image-item-thumb {
      width: 36px;
      height: 48px;
      object-fit: cover;
      border-radius: 4px;
  }

  .image-item-info {
      flex-grow: 1;
      min-width: 0;
  }

  .image-item-title {
      font-size: 0.8rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
  }

  .image-item-remove {
      background: none;
      border: none;
      color: var(--text-dim);
      font-size: 1.1rem;
      cursor: pointer;
  }

  .image-item-remove:hover {
      color: #ff5e62;
  }

  /* Utility classes */
  .hidden {
      display: none !important;
  }
  .hidden-input {
      display: none;
  }

  /* Scrollbar override for glass list */
  .panel-content::-webkit-scrollbar, .image-list::-webkit-scrollbar {
      width: 4px;
  }
  .panel-content::-webkit-scrollbar-thumb, .image-list::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 2px;
  }

  /* Responsive Adjustments */
  @media (max-width: 768px) {
      :root {
          --panel-width: 320px;
      }
      .app-container {
          padding: 20px;
      }
      .gallery-header h1 {
          font-size: 1.8rem;
      }
      .coverflow-track {
          width: 240px;
          height: 330px;
      }
      .card {
          width: 220px;
          height: 290px;
      }
      .panel-toggle {
          top: 20px;
          right: 20px;
      }
  }
  ```

- [ ] **Step 2: Commit stylesheet**
  Commit the newly created stylesheet.
  ```bash
  git add styles.css
  git commit -m "style: implement global tokens, 3D transformations, and control panels"
  ```

---

### Task 3: Core JavaScript Setup & Projection Mathematics

**Files:**
- Create: `app.js`

- [ ] **Step 1: Write app.js base content**
  Define placeholder/preloaded high-res visual cards, layout parameters state, cover flow projection logic, page initialization, active indices tracking, and theme glow shifts.

  Write content to `app.js`:
  ```javascript
  // Preset Default Curated Photography Cards
  const defaultCards = [
      {
          id: 1,
          src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
          title: 'Silicon Matrix',
          desc: 'A futuristic visualization of neural connections and microcircuitry emitting high-energy neon rays.',
          color: '#1a1f3c'
      },
      {
          id: 2,
          src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
          title: 'Geometric Monolith',
          desc: 'Towering office skyscrapers captured in high contrast glass and steel, mapping the sky in grids.',
          color: '#081e28'
      },
      {
          id: 3,
          src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
          title: 'Ethereal Shoreline',
          desc: 'Sunset cascading golden ripples across a gentle, mirror-like tide at the edge of the Pacific.',
          color: '#2b1b1a'
      },
      {
          id: 4,
          src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
          title: 'Liquid Stardust',
          desc: 'Abstract marble flows blending cosmic purples with fluorescent gold veins, frozen in time.',
          color: '#281230'
      },
      {
          id: 5,
          src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
          title: 'Primeval Breath',
          desc: 'Misty sunbeams slicing through ancient Redwood branches in the early, dew-drenched morning.',
          color: '#0c2210'
      }
  ];

  // Gallery Parameters and State
  let cards = [...defaultCards];
  let activeIndex = 2; // Default center card
  let isAutoplay = false;
  let autoplayInterval = null;

  // 3D parameters (coefficients adjusted by slider)
  let paramSpacing = 100;
  let paramAngle = 60;
  let paramDepth = 180;
  let paramAutoplay = 3.5;

  // DOM Elements cache
  const track = document.getElementById('coverflow-track');
  const pagination = document.getElementById('pagination');
  const ambientBg = document.getElementById('ambient-bg');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnPlay = document.getElementById('btn-play');
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');

  // Slider Elements
  const sliderSpacing = document.getElementById('slider-spacing');
  const sliderAngle = document.getElementById('slider-angle');
  const sliderDepth = document.getElementById('slider-depth');
  const sliderAutoplay = document.getElementById('slider-autoplay');
  const valSpacing = document.getElementById('val-spacing');
  const valAngle = document.getElementById('val-angle');
  const valDepth = document.getElementById('val-depth');
  const valAutoplay = document.getElementById('val-autoplay');

  // Control Drawer Elements
  const controlPanel = document.getElementById('control-panel');
  const btnTogglePanel = document.getElementById('btn-toggle-panel');
  const btnClosePanel = document.getElementById('btn-close-panel');
  const imageList = document.getElementById('image-list');

  // Render Card Elements inside Track
  function renderCards() {
      track.innerHTML = '';
      cards.forEach((card, index) => {
          const cardEl = document.createElement('div');
          cardEl.className = 'card';
          cardEl.dataset.index = index;

          cardEl.innerHTML = `
              <div class="card-inner">
                  <div class="card-front">
                      <img src="${card.src}" alt="${card.title}">
                      <div class="card-front-overlay">
                          <h3>${card.title}</h3>
                          <p>Click to examine details</p>
                      </div>
                  </div>
                  <div class="card-back">
                      <h3>${card.title}</h3>
                      <p>${card.desc}</p>
                      <button class="btn-flip-back" onclick="event.stopPropagation(); flipCard(${index}, false)">BACK TO GALLERY</button>
                  </div>
              </div>
          `;

          // Flip card event
          cardEl.addEventListener('click', () => {
              if (index === activeIndex) {
                  const isFlipped = cardEl.classList.contains('flipped');
                  flipCard(index, !isFlipped);
              } else {
                  setActiveCard(index);
              }
          });

          track.appendChild(cardEl);
      });

      renderPagination();
      updateCoverflow();
  }

  // Render indicators
  function renderPagination() {
      pagination.innerHTML = '';
      cards.forEach((_, index) => {
          const dot = document.createElement('div');
          dot.className = `dot ${index === activeIndex ? 'active' : ''}`;
          dot.addEventListener('click', () => setActiveCard(index));
          pagination.appendChild(dot);
      });
  }

  // Calculate and Apply 3D Projections dynamically
  function updateCoverflow() {
      const cardEls = document.querySelectorAll('.card');
      cardEls.forEach((cardEl, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);

          if (offset === 0) {
              // Active Center Card
              cardEl.style.transform = `translate3d(0, 0, 80px) rotateY(0deg) scale(1)`;
              cardEl.style.opacity = 1;
              cardEl.style.filter = 'none';
              cardEl.classList.add('active');
              cardEl.style.pointerEvents = 'auto';
          } else {
              // Left & Right Side Cards
              const direction = offset > 0 ? 1 : -1;
              const angle = direction * -paramAngle;
              const transX = offset * paramSpacing + direction * 40;
              const transZ = -absOffset * paramDepth;
              const scale = Math.pow(0.92, absOffset);

              cardEl.style.transform = `translate3d(${transX}px, 0, ${transZ}px) rotateY(${angle}deg) scale(${scale})`;
              cardEl.style.opacity = Math.max(0.15, 1 - absOffset * 0.3);
              cardEl.style.filter = absOffset > 1 ? `blur(${absOffset * 1.5}px)` : 'none';
              cardEl.classList.remove('active');
              cardEl.classList.remove('flipped'); // Reset flip if shifted out
              cardEl.style.pointerEvents = absOffset === 1 ? 'auto' : 'none'; // Only allow adjacent clicks
          }
      });

      updateAmbientBg();
  }

  // Update Ambient lighting based on current active card theme color
  function updateAmbientBg() {
      if (cards[activeIndex]) {
          const color = cards[activeIndex].color || '#1b203a';
          ambientBg.style.background = `radial-gradient(circle at center, ${color} 0%, var(--bg-dark) 100%)`;
      }
  }

  // Flip Active Card to show information on Back
  function flipCard(index, shouldFlip) {
      const cardEl = document.querySelector(`.card[data-index="${index}"]`);
      if (cardEl && index === activeIndex) {
          if (shouldFlip) {
              cardEl.classList.add('flipped');
          } else {
              cardEl.classList.remove('flipped');
          }
      }
  }

  // Shift to active card
  function setActiveCard(index) {
      if (index >= 0 && index < cards.length) {
          activeIndex = index;
          
          // Update dot states
          const dots = document.querySelectorAll('.dot');
          dots.forEach((dot, idx) => {
              if (idx === activeIndex) dot.classList.add('active');
              else dot.classList.remove('active');
          });

          updateCoverflow();
      }
  }

  function nextCard() {
      if (activeIndex < cards.length - 1) {
          setActiveCard(activeIndex + 1);
      } else {
          setActiveCard(0); // Loop back
      }
  }

  function prevCard() {
      if (activeIndex > 0) {
          setActiveCard(activeIndex - 1);
      } else {
          setActiveCard(cards.length - 1); // Loop to end
      }
  }

  // Init Event Listeners for Nav buttons
  btnPrev.addEventListener('click', () => {
      prevCard();
      resetAutoplay();
  });
  btnNext.addEventListener('click', () => {
      nextCard();
      resetAutoplay();
  });

  // Init render on window load
  window.addEventListener('DOMContentLoaded', () => {
      renderCards();
  });
  ```

- [ ] **Step 2: Commit core script**
  Commit the baseline javascript implementation.
  ```bash
  git add app.js
  git commit -m "feat: implement dynamic 3D coordinate projection, core state rendering, and transitions"
  ```

---

### Task 4: Interactive Handlers (Drag, Swipe, Tilt, Autoplay)

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Write dragging and swipe event handlers**
  Implement mouse dragging and touch swiping directly on `#coverflow-track` with trackpad emulation, velocity calculations, inertia momentum slide, and release mechanics.

  Append code to `app.js`:
  ```javascript
  // Drag & Swipe Interaction State
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let trackStartX = 0;
  let dragOffset = 0;
  let velocity = 0;
  let lastTime = 0;
  let lastX = 0;
  let animationId = null;

  // Bind mouse and touch track listeners
  track.addEventListener('mousedown', dragStart);
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);

  track.addEventListener('touchstart', dragStart, { passive: true });
  window.addEventListener('touchmove', dragMove, { passive: false });
  window.addEventListener('touchend', dragEnd);

  function dragStart(e) {
      if (e.target.closest('.btn-flip-back')) return; // Ignore if back button clicked
      
      const activeCardEl = document.querySelector('.card.active');
      if (activeCardEl && activeCardEl.classList.contains('flipped')) return; // No drag on flipped card

      isDragging = true;
      startX = getPositionX(e);
      lastX = startX;
      lastTime = performance.now();
      velocity = 0;
      dragOffset = 0;

      if (animationId) cancelAnimationFrame(animationId);
      resetAutoplay();
  }

  function dragMove(e) {
      if (!isDragging) return;

      currentX = getPositionX(e);
      const currentTime = performance.now();
      const dt = currentTime - lastTime;
      const dx = currentX - lastX;

      if (dt > 0) {
          velocity = dx / dt; // pixels per millisecond
      }

      dragOffset = currentX - startX;
      
      // Calculate how many indices to shift based on drag displacement
      const threshold = 120; // threshold pixels to trigger slide shift
      if (Math.abs(dragOffset) > threshold) {
          if (dragOffset > 0) {
              prevCard();
          } else {
              nextCard();
          }
          isDragging = false; // complete transition
      }

      lastX = currentX;
      lastTime = currentTime;
  }

  function dragEnd(e) {
      if (!isDragging) return;
      isDragging = false;

      // Handle inertia flick if mouse dragged quickly
      const flickSpeed = 0.5; // px/ms threshold
      if (Math.abs(velocity) > flickSpeed) {
          if (velocity > 0) {
              prevCard();
          } else {
              nextCard();
          }
      }
  }

  function getPositionX(e) {
      return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  }
  ```

- [ ] **Step 2: Implement keyboard arrow, wheel scroll, and hover tilt effects**
  Add scroll wheel delta detection, keyboard left/right key actions, and a 3D hover tilt perspective transform on the active card.

  Append code to `app.js`:
  ```javascript
  // Keyboard Arrow navigation
  window.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT') return; // Ignore if typing in inputs
      if (e.key === 'ArrowLeft') {
          prevCard();
          resetAutoplay();
      } else if (e.key === 'ArrowRight') {
          nextCard();
          resetAutoplay();
      }
  });

  // Mouse Wheel navigation
  let wheelTimeout = null;
  track.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (wheelTimeout) return; // Debounce wheel events
      
      if (e.deltaX > 20 || e.deltaY > 20) {
          nextCard();
          resetAutoplay();
      } else if (e.deltaX < -20 || e.deltaY < -20) {
          prevCard();
          resetAutoplay();
      }
      
      wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
      }, 350);
  }, { passive: false });

  // Hover Tilt 3D Parallax on Active Card
  window.addEventListener('mousemove', (e) => {
      const activeCardEl = document.querySelector('.card.active');
      if (!activeCardEl || activeCardEl.classList.contains('flipped')) return;

      const rect = activeCardEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only apply tilt if hover is within card boundaries
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateY = ((x - centerX) / centerX) * 12; // max tilt 12deg
          const rotateX = -((y - centerY) / centerY) * 12;

          const cardInner = activeCardEl.querySelector('.card-inner');
          if (cardInner) {
              cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          }
      } else {
          // Reset card-inner style if cursor leaves card
          const cardInner = activeCardEl.querySelector('.card-inner');
          if (cardInner && !activeCardEl.classList.contains('flipped')) {
              cardInner.style.transform = '';
          }
      }
  });
  ```

- [ ] **Step 3: Implement Autoplay Mechanics**
  Setup play/pause button state triggers, interval callbacks, dynamic pause-on-hover triggers, and resets.

  Append code to `app.js`:
  ```javascript
  // Autoplay functionality
  function startAutoplay() {
      isAutoplay = true;
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      autoplayInterval = setInterval(nextCard, paramAutoplay * 1000);
  }

  function stopAutoplay() {
      isAutoplay = false;
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      if (autoplayInterval) {
          clearInterval(autoplayInterval);
          autoplayInterval = null;
      }
  }

  function resetAutoplay() {
      if (isAutoplay) {
          stopAutoplay();
          startAutoplay();
      }
  }

  btnPlay.addEventListener('click', () => {
      if (isAutoplay) {
          stopAutoplay();
      } else {
          startAutoplay();
      }
  });

  // Pause autoplay on hovering the cover flow
  track.addEventListener('mouseenter', () => {
      if (isAutoplay && autoplayInterval) {
          clearInterval(autoplayInterval);
      }
  });

  track.addEventListener('mouseleave', () => {
      if (isAutoplay) {
          autoplayInterval = setInterval(nextCard, paramAutoplay * 1000);
      }
  });
  ```

- [ ] **Step 4: Commit interactive features**
  Commit navigation controllers, hover tilt, and autoplay mechanisms.
  ```bash
  git add app.js
  git commit -m "feat: add drag swiping, mousewheel navigation, hover parallax tilt, and autoplay"
  ```

---

### Task 5: Settings Control, File Uploads, & Card Management

**Files:**
- Modify: `app.js`

- [ ] **Step 1: Write control drawer and slider configuration events**
  Handle settings sliders change events, toggle/close control panel drawer buttons, and apply modified coefficients immediately to track layouts.

  Append code to `app.js`:
  ```javascript
  // Toggle control drawer
  btnTogglePanel.addEventListener('click', () => {
      controlPanel.classList.add('open');
  });

  btnClosePanel.addEventListener('click', () => {
      controlPanel.classList.remove('open');
  });

  // Close when clicking outside panel
  document.addEventListener('click', (e) => {
      if (!controlPanel.contains(e.target) && e.target !== btnTogglePanel && !btnTogglePanel.contains(e.target)) {
          controlPanel.classList.remove('open');
      }
  });

  // Sliders binding listeners
  sliderSpacing.addEventListener('input', (e) => {
      paramSpacing = parseInt(e.target.value);
      valSpacing.textContent = paramSpacing;
      updateCoverflow();
  });

  sliderAngle.addEventListener('input', (e) => {
      paramAngle = parseInt(e.target.value);
      valAngle.textContent = paramAngle;
      updateCoverflow();
  });

  sliderDepth.addEventListener('input', (e) => {
      paramDepth = parseInt(e.target.value);
      valDepth.textContent = paramDepth;
      updateCoverflow();
  });

  sliderAutoplay.addEventListener('input', (e) => {
      paramAutoplay = parseFloat(e.target.value);
      valAutoplay.textContent = paramAutoplay.toFixed(1);
      resetAutoplay();
  });
  ```

- [ ] **Step 2: Implement image list manager & image adding forms**
  Implement dynamic list render of current cards inside settings drawer, file uploader tabs selector logic, file drop zones file parse, dynamic blob URL creator, and URL forms parser.

  Append code to `app.js`:
  ```javascript
  // Tab selector logic
  const methodFile = document.getElementById('method-file');
  const methodUrl = document.getElementById('method-url');
  const fileUploadContainer = document.getElementById('file-upload-container');
  const urlUploadForm = document.getElementById('url-upload-form');

  methodFile.addEventListener('click', () => {
      methodFile.classList.add('active');
      methodUrl.classList.remove('active');
      fileUploadContainer.classList.remove('hidden');
      urlUploadForm.classList.add('hidden');
  });

  methodUrl.addEventListener('click', () => {
      methodUrl.classList.add('active');
      methodFile.classList.remove('active');
      urlUploadForm.classList.remove('hidden');
      fileUploadContainer.classList.add('hidden');
  });

  // Render Image list in Settings Panel
  function renderImageList() {
      imageList.innerHTML = '';
      cards.forEach((card, index) => {
          const li = document.createElement('li');
          li.className = 'image-item';
          li.innerHTML = `
              <img src="${card.src}" alt="${card.title}" class="image-item-thumb">
              <div class="image-item-info">
                  <div class="image-item-title">${card.title}</div>
              </div>
              <button class="image-item-remove" data-index="${index}">&times;</button>
          `;

          li.querySelector('.image-item-remove').addEventListener('click', (e) => {
              const idx = parseInt(e.target.dataset.index);
              removeCard(idx);
          });

          imageList.appendChild(li);
      });
  }

  function removeCard(index) {
      if (cards.length <= 1) {
          alert('至少需要保留一张图片！');
          return;
      }
      cards.splice(index, 1);
      
      // Update activeIndex if it exceeds bounds or matches deleted index
      if (activeIndex >= cards.length) {
          activeIndex = cards.length - 1;
      }
      
      renderCards();
      renderImageList();
  }

  // Bind new render to base load
  window.addEventListener('DOMContentLoaded', () => {
      renderImageList();
  });

  // URL Input submit handler
  urlUploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const src = document.getElementById('url-input').value;
      const title = document.getElementById('title-input').value || 'Unlabeled Card';
      
      // Extract a random dominant-looking ambient color based on current colors
      const colorOptions = ['#1a1f3c', '#081e28', '#2b1b1a', '#281230', '#0c2210', '#1c1b30', '#3b2f1a'];
      const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

      const newCard = {
          id: Date.now(),
          src: src,
          title: title,
          desc: 'A user submitted custom network image added to the dynamic cover flow carousel stack.',
          color: randomColor
      };

      cards.push(newCard);
      activeIndex = cards.length - 1; // shift focus to new image
      
      renderCards();
      renderImageList();

      // Reset form
      urlUploadForm.reset();
  });

  // Local file upload handling
  const fileInput = document.getElementById('file-input');
  fileUploadContainer.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', handleFileSelect);

  // Drag & drop handlers
  fileUploadContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileUploadContainer.classList.add('dragover');
  });

  fileUploadContainer.addEventListener('dragleave', () => {
      fileUploadContainer.classList.remove('dragover');
  });

  fileUploadContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      fileUploadContainer.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
          fileInput.files = e.dataTransfer.files;
          handleFileSelect();
      }
  });

  function handleFileSelect() {
      const file = fileInput.files[0];
      if (file && file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
              const src = e.target.result;
              const title = file.name.split('.')[0] || 'Local Image';

              const colorOptions = ['#1a1f3c', '#081e28', '#2b1b1a', '#281230', '#0c2210', '#1c1b30', '#3b2f1a'];
              const randomColor = colorOptions[Math.floor(Math.random() * colorOptions.length)];

              const newCard = {
                  id: Date.now(),
                  src: src,
                  title: title,
                  desc: `Uploaded file: ${file.name} (type: ${file.type}, size: ${(file.size / 1024).toFixed(1)}KB) displayed on 3D Cover Flow layout.`,
                  color: randomColor
              };

              cards.push(newCard);
              activeIndex = cards.length - 1;

              renderCards();
              renderImageList();
          };
          reader.readAsDataURL(file);
      } else {
          alert('请上传有效的图片文件！');
      }
  }
  ```

- [ ] **Step 3: Commit settings and files upload manager**
  Commit slider controllers and file uploader modules.
  ```bash
  git add app.js
  git commit -m "feat: implement sliders configuration drawer, image list manager, and drag & drop image upload"
  ```

---

### Task 6: UI Polish, Final Verification and Demo Server Startup

**Files:**
- Modify: `styles.css`
- Modify: `index.html`

- [ ] **Step 1: Check UI Responsive margins and visual highlights**
  Add hover effects on all buttons, style the drag & drop area to look extremely professional, add active sliders highlights.

  Write changes to `styles.css` (add to the bottom of the file):
  ```css
  /* Added final polish details */
  .method-tab:focus-visible, .nav-btn:focus-visible, .submit-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
  }

  .card-front-overlay::before {
      content: "";
      position: absolute;
      inset: 0;
      box-shadow: inset 0 0 20px rgba(255,255,255,0.1);
      border-radius: 16px;
      pointer-events: none;
  }
  ```

- [ ] **Step 2: Start local preview**
  Start `http-server` or any local web server on port `8080` to let the user preview the final immersive gallery.

  Run: `npx -y http-server ./` in a background terminal.
