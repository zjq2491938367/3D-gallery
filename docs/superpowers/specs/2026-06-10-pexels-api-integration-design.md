# Spec: Pexels API Hybrid Integration

This specification defines the additions and logic required to integrate the Pexels API using the user-supplied API Key. The goal is to provide a dynamic startup exhibition using curated images and support in-app searching/adding of photos in the settings drawer.

## API Setup
- **API Key**: `gdSbKXJR7lYB0uAB1oOOwsMMr6rdsBhoLbkcO6rRrF8V9Hr6HCutHMgm`
- **Request Headers**: `Authorization: gdSbKXJR7lYB0uAB1oOOwsMMr6rdsBhoLbkcO6rRrF8V9Hr6HCutHMgm`
- **Curated Endpoint**: `https://api.pexels.com/v1/curated?per_page=10`
- **Search Endpoint**: `https://api.pexels.com/v1/search?query=[query]&per_page=12`

---

## User Interface changes

### [index.html](file:///z:/VibeCoding/A/index.html)
- Add a third tab selector button `<button id="method-pexels" class="method-tab">Pexels Search</button>` inside the `.add-methods` wrapper.
- Add a new container `<div id="pexels-search-container" class="url-form hidden">` under the settings content. It includes:
  - An input search bar `<input type="text" id="pexels-query-input" placeholder="e.g. nature, neon, space">`
  - A search submission button `<button id="btn-pexels-search" class="submit-btn">Search Pexels</button>`
  - A scrollable grid wrapper `<div id="pexels-search-results" class="pexels-grid">` to display thumbnail result previews.
  - A simple loading/status text indicator `<div id="pexels-search-status" class="pexels-status hidden">Searching...</div>`

### [styles.css](file:///z:/VibeCoding/A/styles.css)
- Implement CSS classes for the Pexels Search tab, query input, results grid, and status text.
- Grid layout:
  ```css
  .pexels-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      max-height: 180px;
      overflow-y: auto;
      margin-top: 10px;
      padding-right: 4px;
  }
  .pexels-thumb {
      position: relative;
      aspect-ratio: 3 / 4;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid var(--glass-border);
      cursor: pointer;
      transition: all 0.25s ease;
  }
  .pexels-thumb:hover {
      border-color: var(--accent);
      transform: scale(1.04);
  }
  .pexels-thumb img {
      width: 100%;
      height: 100%;
      object-fit: cover;
  }
  .pexels-status {
      font-size: 0.8rem;
      color: var(--text-dim);
      text-align: center;
      margin-top: 10px;
  }
  ```

---

## JavaScript Logic

### [app.js](file:///z:/VibeCoding/A/app.js)
- Define a constant `PEXELS_API_KEY` with the user's key.
- Cache DOM elements:
  - `#method-pexels`
  - `#pexels-search-container`
  - `#pexels-query-input`
  - `#btn-pexels-search`
  - `#pexels-search-results`
  - `#pexels-search-status`
- **Dynamic Startup Load**:
  - Implement an asynchronous function `loadPexelsCurated()`.
  - Fetch 10 photos from `https://api.pexels.com/v1/curated?per_page=10`.
  - On successful response:
    - Clear the initial `cards` array.
    - Transform Pexels photos into our card format:
      - `src`: `photo.src.portrait` (optimized vertical ratio for portrait cards)
      - `title`: `photo.alt || 'Pexels Photo'`
      - `desc`: `Photo by ${photo.photographer} on Pexels.`
      - `color`: `photo.avg_color` (which automatically changes the ambient theme color!)
      - `location`: `'Pexels Curated'`
      - `camera`: `By: ${photo.photographer}`
    - Set `activeIndex = 4` (middle card for 10 items).
    - Call `renderCards()` and `renderImageList()`.
  - On network error or failed API key:
    - Silently fall back to `defaultCards` so the page initializes correctly with local placeholders.
- **Dynamic Pexels Search**:
  - Implement `searchPexels(query)`.
  - Fetch photos from `https://api.pexels.com/v1/search?query=[query]&per_page=12`.
  - Render results inside `#pexels-search-results` as clickable `.pexels-thumb` containers containing `photo.src.tiny`.
  - Add click handlers on thumbnails: when clicked, convert that specific photo to our card format, append it to `cards`, set `activeIndex = cards.length - 1` to shift view, and call `renderCards()` and `renderImageList()`.
- **Tab Selection**:
  - Add logic to activate the Pexels Search tab, showing `#pexels-search-container` and hiding file/URL inputs.

---

## Verification Plan
1. **Curated Load**: Load the page; verify that the initial cards are loaded dynamically from Pexels, displaying a fresh batch of photos. Verify the dynamic ambient color shifts to match the loaded photos.
2. **Search Verification**: Search for `"space"`; click one of the thumbnails in the settings panel grid, and check that it successfully appends to the Cover Flow track and centers as the active card.
3. **Fallback Guard**: Temporarily block the network request or use a bad key; verify that the gallery loads successfully using the 5 default Unsplash local cards without crashing the interface.
