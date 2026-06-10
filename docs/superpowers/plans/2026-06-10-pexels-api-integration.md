# Pexels API Hybrid Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate Pexels API into the immersive gallery to load curated photos dynamically on page load and provide in-app photo search capability within the control panel.

**Architecture:** Inject UI search elements in `index.html`, style results as a grid of thumbnails in `styles.css`, and handle HTTP requests, state updates, fallback routines, and event handlers in `app.js` using the provided API Key.

**Tech Stack:** Vanilla HTML, CSS, JavaScript (No external libraries, standard browser Fetch API).

---

### Task 1: Add HTML Markup

**Files:**
- Modify: [index.html](file:///z:/VibeCoding/A/index.html)

- [ ] **Step 1: Add the Pexels Search tab button**
  In `index.html` (inside the `.add-methods` wrapper, around line 90), insert the button right after the URL button:
  ```html
  <button id="method-pexels" class="method-tab">Pexels Search</button>
  ```

- [ ] **Step 2: Add the Pexels search form and results grid container**
  In `index.html` (under the `#url-upload-form` element, around line 108), insert the new container:
  ```html
                    <!-- Pexels Search container -->
                    <div id="pexels-search-container" class="url-form hidden">
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="pexels-query-input" placeholder="e.g. nature, neon, cyberpunk" style="flex-grow: 1;">
                            <button type="button" id="btn-pexels-search" class="submit-btn" style="width: auto; padding: 0 16px;">Search</button>
                        </div>
                        <div id="pexels-search-status" class="pexels-status hidden">Searching Pexels...</div>
                        <div id="pexels-search-results" class="pexels-grid">
                            <!-- Thumbnails dynamically rendered here -->
                        </div>
                    </div>
  ```

- [ ] **Step 3: Verify structure load**
  Verify the page loads on `http://localhost:8080` without HTML syntax errors.

- [ ] **Step 4: Commit changes**
  ```bash
  git add index.html
  git commit -m "feat: add pexels search inputs and container markup"
  ```

---

### Task 2: Style Pexels Search Tab & Previews

**Files:**
- Modify: [styles.css](file:///z:/VibeCoding/A/styles.css)

- [ ] **Step 1: Add grid and thumbnail styles**
  Append the following CSS rules at the bottom of `styles.css`:
  ```css
  /* Pexels search results styling */
  .pexels-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      max-height: 180px;
      overflow-y: auto;
      margin-top: 12px;
      padding-right: 4px;
      scrollbar-width: thin;
      scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  }

  .pexels-thumb {
      position: relative;
      aspect-ratio: 3 / 4;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--glass-border);
      cursor: pointer;
      transition: border-color 0.25s ease, transform 0.25s ease;
  }

  .pexels-thumb:hover {
      border-color: var(--accent);
      transform: translateY(-2px) scale(1.02);
  }

  .pexels-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      pointer-events: none;
  }

  .pexels-status {
      font-size: 0.8rem;
      color: var(--text-dim);
      text-align: center;
      margin-top: 10px;
  }
  ```

- [ ] **Step 2: Verify alignment**
  Ensure the new elements fit within the sidebar control panel.

- [ ] **Step 3: Commit changes**
  ```bash
  git add styles.css
  git commit -m "style: add pexels search grid and thumbnail styles"
  ```

---

### Task 3: Implement Pexels API Logic

**Files:**
- Modify: [app.js](file:///z:/VibeCoding/A/app.js)

- [ ] **Step 1: Add PEXELS_API_KEY constant and cache DOM elements**
  Add the API key constant and cache the new DOM elements at the top of `app.js` (under the Story Mode elements section, around line 111):
  ```javascript
  const PEXELS_API_KEY = 'gdSbKXJR7lYB0uAB1oOOwsMMr6rdsBhoLbkcO6rRrF8V9Hr6HCutHMgm';

  // Pexels Search elements
  const methodPexels = document.getElementById('method-pexels');
  const pexelsSearchContainer = document.getElementById('pexels-search-container');
  const pexelsQueryInput = document.getElementById('pexels-query-input');
  const btnPexelsSearch = document.getElementById('btn-pexels-search');
  const pexelsSearchResults = document.getElementById('pexels-search-results');
  const pexelsSearchStatus = document.getElementById('pexels-search-status');
  ```

- [ ] **Step 2: Bind Tab selectors logic for Pexels Search**
  Extend tab listener logic in `app.js` (around line 520) to show/hide the Pexels search tab:
  - Add active state handling for `methodPexels` and display `#pexels-search-container`.
  - Update `methodFile` and `methodUrl` listeners to hide `#pexels-search-container`.
  
  Code replacement:
  ```javascript
  // Tab selector logic
  const methodFile = document.getElementById('method-file');
  const methodUrl = document.getElementById('method-url');
  const fileUploadContainer = document.getElementById('file-upload-container');
  const urlUploadForm = document.getElementById('url-upload-form');

  methodFile.addEventListener('click', () => {
      methodFile.classList.add('active');
      methodUrl.classList.remove('active');
      methodPexels.classList.remove('active');
      fileUploadContainer.classList.remove('hidden');
      urlUploadForm.classList.add('hidden');
      pexelsSearchContainer.classList.add('hidden');
  });

  methodUrl.addEventListener('click', () => {
      methodUrl.classList.add('active');
      methodFile.classList.remove('active');
      methodPexels.classList.remove('active');
      urlUploadForm.classList.remove('hidden');
      fileUploadContainer.classList.add('hidden');
      pexelsSearchContainer.classList.add('hidden');
  });

  methodPexels.addEventListener('click', () => {
      methodPexels.classList.add('active');
      methodFile.classList.remove('active');
      methodUrl.classList.remove('active');
      pexelsSearchContainer.classList.remove('hidden');
      fileUploadContainer.classList.add('hidden');
      urlUploadForm.classList.add('hidden');
  });
  ```

- [ ] **Step 3: Implement loadPexelsCurated() for page load**
  Implement the startup loader `loadPexelsCurated()` in `app.js` (above the DOMContentLoaded handler):
  ```javascript
  // Fetch curated photos from Pexels API to initialize the gallery
  async function loadPexelsCurated() {
      try {
          const response = await fetch('https://api.pexels.com/v1/curated?per_page=10', {
              headers: { Authorization: PEXELS_API_KEY }
          });
          if (!response.ok) throw new Error('API request failed');
          const data = await response.json();
          if (data.photos && data.photos.length > 0) {
              cards = data.photos.map(photo => ({
                  id: photo.id,
                  src: photo.src.portrait || photo.src.large,
                  title: photo.alt || 'Pexels Exhibition',
                  desc: `Photo by ${photo.photographer} on Pexels. ${photo.alt || ''}`,
                  color: photo.avg_color || '#1b203a',
                  location: 'Pexels Curated',
                  camera: `Photographer: ${photo.photographer}`
              }));
              activeIndex = Math.floor(cards.length / 2); // Set default middle index
              renderCards();
              renderImageList();
          }
      } catch (err) {
          console.warn('Pexels Curated load failed, falling back to local presets:', err);
          // Fallback to local default cards (cards array already holds defaultCards)
          renderCards();
          renderImageList();
      }
  }
  ```

- [ ] **Step 4: Implement searchPexels() and thumbnail selection**
  Add the search and addition logic to `app.js`:
  ```javascript
  // Search photos on Pexels API
  async function searchPexels() {
      const query = pexelsQueryInput.value.trim();
      if (!query) return;

      pexelsSearchStatus.textContent = 'Searching Pexels...';
      pexelsSearchStatus.classList.remove('hidden');
      pexelsSearchResults.innerHTML = '';

      try {
          const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`, {
              headers: { Authorization: PEXELS_API_KEY }
          });
          if (!response.ok) throw new Error('Search failed');
          const data = await response.json();
          
          pexelsSearchStatus.classList.add('hidden');
          if (!data.photos || data.photos.length === 0) {
              pexelsSearchStatus.textContent = 'No results found.';
              pexelsSearchStatus.classList.remove('hidden');
              return;
          }

          data.photos.forEach(photo => {
              const thumb = document.createElement('div');
              thumb.className = 'pexels-thumb';
              thumb.innerHTML = `<img src="${escapeHTML(photo.src.tiny)}" alt="${escapeHTML(photo.alt)}">`;
              
              thumb.addEventListener('click', () => {
                  const newCard = {
                      id: photo.id,
                      src: photo.src.portrait || photo.src.large,
                      title: photo.alt || 'Pexels Photo',
                      desc: `Photo by ${photo.photographer} on Pexels. ${photo.alt || ''}`,
                      color: photo.avg_color || '#1b203a',
                      location: 'Pexels Search',
                      camera: `Photographer: ${photo.photographer}`
                  };
                  cards.push(newCard);
                  activeIndex = cards.length - 1; // Focus the newly added card
                  renderCards();
                  renderImageList();
                  
                  // Reset search input and results
                  pexelsQueryInput.value = '';
                  pexelsSearchResults.innerHTML = '';
              });

              pexelsSearchResults.appendChild(thumb);
          });
      } catch (err) {
          console.error(err);
          pexelsSearchStatus.textContent = 'Error fetching search results.';
          pexelsSearchStatus.classList.remove('hidden');
      }
  }

  // Bind Pexels Search events
  btnPexelsSearch.addEventListener('click', searchPexels);
  pexelsQueryInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          searchPexels();
      }
  });
  ```

- [ ] **Step 5: Call loadPexelsCurated() inside the DOMContentLoaded handler**
  In the `DOMContentLoaded` handler at the bottom of `app.js`:
  ```javascript
  // Init render on window load
  window.addEventListener('DOMContentLoaded', () => {
      loadPexelsCurated();
  });
  ```
  *(Note: `loadPexelsCurated()` calls `renderCards()` and `renderImageList()` internally, so we don't need to call them directly on page load if curated loading is started).*

- [ ] **Step 6: Verify the dynamic startup load, tab layout, and search inputs**
  Open the page `http://localhost:8080` in the browser. Verify 10 curated images load, then search for a term and select a thumbnail to verify that the image is added as a new card.

- [ ] **Step 7: Commit script changes**
  ```bash
  git add app.js
  git commit -m "feat: implement pexels curated load and query search in app.js"
  ```
