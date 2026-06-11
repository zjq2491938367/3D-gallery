// Helper to escape HTML characters for XSS prevention
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Global Ambient Theme Colors
const AMBIENT_COLORS = ['#1a1f3c', '#081e28', '#2b1b1a', '#281230', '#0c2210', '#1c1b30', '#3b2f1a'];

// Preset Default Curated Photography Cards
const defaultCards = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        title: 'Silicon Matrix',
        desc: 'A futuristic visualization of neural connections and microcircuitry emitting high-energy neon rays.',
        color: '#1a1f3c',
        location: 'Tokyo, Japan',
        camera: 'Sony Alpha 7R V • 35mm f/1.4'
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        title: 'Geometric Monolith',
        desc: 'Towering office skyscrapers captured in high contrast glass and steel, mapping the sky in grids.',
        color: '#081e28',
        location: 'Chicago, USA',
        camera: 'Hasselblad X2D 100C • 28mm f/4'
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        title: 'Ethereal Shoreline',
        desc: 'Sunset cascading golden ripples across a gentle, mirror-like tide at the edge of the Pacific.',
        color: '#2b1b1a',
        location: 'Big Sur, California',
        camera: 'Leica M11 • 50mm f/2'
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
        title: 'Liquid Stardust',
        desc: 'Abstract marble flows blending cosmic purples with fluorescent gold veins, frozen in time.',
        color: '#281230',
        location: 'Studio Macro, Paris',
        camera: 'Fujifilm GFX 100S • 120mm f/4'
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
        title: 'Primeval Breath',
        desc: 'Misty sunbeams slicing through ancient Redwood branches in the early, dew-drenched morning.',
        color: '#0c2210',
        location: 'Redwood Park, USA',
        camera: 'Canon EOS R5 • 24-70mm f/2.8'
    }
];

// Gallery Parameters and State
let cards = [...defaultCards];
let activeIndex = 2; // Default center card
let isAutoplay = false;
let autoplayInterval = null;
let cardEls = [];
let dotEls = [];
let isStoryMode = false;
let wasAutoplayBeforeStory = false;

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

// Story Mode Elements
const appContainer = document.querySelector('.app-container');
const storyDetailsPanel = document.getElementById('story-details-panel');
const storyTitle = document.getElementById('story-detail-title');
const storyDesc = document.getElementById('story-detail-desc');
const storyLocation = document.getElementById('story-detail-location');
const storyCamera = document.getElementById('story-detail-camera');
const btnBackToGallery = document.getElementById('btn-back-to-gallery');
const decorActiveIndex = document.getElementById('decor-active-index');
const decorTotalCount = document.getElementById('decor-total-count');

let paramGlow = 0.60;

// Cache slider glow elements
const sliderGlow = document.getElementById('slider-glow');
const valGlow = document.getElementById('val-glow');

const PEXELS_API_KEY = 'gdSbKXJR7lYB0uAB1oOOwsMMr6rdsBhoLbkcO6rRrF8V9Hr6HCutHMgm';

// Pexels Search elements
const methodPexels = document.getElementById('method-pexels');
const pexelsSearchContainer = document.getElementById('pexels-search-container');
const pexelsQueryInput = document.getElementById('pexels-query-input');
const btnPexelsSearch = document.getElementById('btn-pexels-search');
const pexelsSearchResults = document.getElementById('pexels-search-results');
const pexelsSearchStatus = document.getElementById('pexels-search-status');

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
    const currentCardEls = Array.from(cardEls);
    const introDelay = cards.length * 60 + 650;
    setTimeout(() => {
        track.classList.remove('intro');
        
        // Clear transition delay after animation finishes so drag/swipes are instant
        setTimeout(() => {
            currentCardEls.forEach(cardEl => {
                cardEl.style.transitionDelay = '';
            });
        }, introDelay); // duration of staggered delay + transition duration
    }, 50);
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
    dotEls = document.querySelectorAll('.dot');
}

// Calculate and Apply 3D Projections dynamically
function updateCoverflow() {
    cardEls.forEach((cardEl, index) => {
        let offset = index - activeIndex;
        
        // Circular wrap-around offset calculation to enable infinite circular loop
        const half = cards.length / 2;
        if (offset > half) {
            offset -= cards.length;
        } else if (offset < -half) {
            offset += cards.length;
        }
        
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
        ambientBg.style.opacity = paramGlow;
    }
}

// Update left/right margin dynamic indicator elements
function updateDecorations() {
    if (decorActiveIndex && decorTotalCount) {
        decorActiveIndex.textContent = String(activeIndex + 1).padStart(2, '0');
        decorTotalCount.textContent = String(cards.length).padStart(2, '0');
    }
}

// Enter fullscreen story mode
function enterStoryMode() {
    if (isStoryMode) return;
    isStoryMode = true;
    
    // Remember autoplay state and pause it
    wasAutoplayBeforeStory = isAutoplay;
    if (isAutoplay) {
        stopAutoplay();
        // stopAutoplay sets isAutoplay to false, so restore the flag for memory
        wasAutoplayBeforeStory = true;
    }
    
    // Populate details panel
    const activeCard = cards[activeIndex];
    storyTitle.textContent = activeCard.title;
    storyDesc.textContent = activeCard.desc;
    storyLocation.textContent = activeCard.location || 'Unknown Location';
    storyCamera.textContent = activeCard.camera || 'Unknown Camera';
    
    // Add class to container to trigger CSS transitions
    appContainer.classList.add('story-mode');
}

// Exit story mode and return to gallery
function exitStoryMode() {
    if (!isStoryMode) return;
    isStoryMode = false;
    
    // Remove class from container to transition back
    appContainer.classList.remove('story-mode');
    
    // Resume autoplay if it was active before
    if (wasAutoplayBeforeStory) {
        startAutoplay();
    }
}

// Shift to active card
function setActiveCard(index) {
    if (isStoryMode) return;
    if (index >= 0 && index < cards.length) {
        activeIndex = index;
        activeCardRect = null; // Reset cached bounding rect
        
        // Update dot states
        dotEls.forEach((dot, idx) => {
            if (idx === activeIndex) dot.classList.add('active');
            else dot.classList.remove('active');
        });

        updateCoverflow();
        updateDecorations();
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

// Drag & Swipe Interaction State
let isDragging = false;
let startX = 0;
let currentX = 0;
let dragOffset = 0;
let velocity = 0;
let lastTime = 0;
let lastX = 0;
let activeCardRect = null;

// Bind mouse and touch track listeners
track.addEventListener('mousedown', dragStart);
window.addEventListener('mousemove', dragMove);
window.addEventListener('mouseup', dragEnd);

track.addEventListener('touchstart', dragStart, { passive: true });
window.addEventListener('touchmove', dragMove, { passive: false });
window.addEventListener('touchend', dragEnd);

function dragStart(e) {
    if (isStoryMode) return; // Guard
    
    isDragging = true;
    startX = getPositionX(e);
    lastX = startX;
    lastTime = performance.now();
    velocity = 0;
    dragOffset = 0;

    resetAutoplay();
}

function dragMove(e) {
    if (isStoryMode) return; // Guard
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

function dragEnd() {
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

// Keyboard Arrow navigation
window.addEventListener('keydown', (e) => {
    if (isStoryMode) return; // Guard
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
    if (isStoryMode) return; // Guard
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
track.addEventListener('mouseenter', () => {
    if (isStoryMode) return; // Guard
    if (isAutoplay && autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    const activeCardEl = document.querySelector('.card.active');
    if (activeCardEl) {
        activeCardRect = activeCardEl.getBoundingClientRect();
    }
});

track.addEventListener('mousemove', (e) => {
    if (isStoryMode) return; // Guard
    const activeCardEl = document.querySelector('.card.active');
    if (!activeCardEl) return;

    if (!activeCardRect) {
        activeCardRect = activeCardEl.getBoundingClientRect();
    }

    const x = e.clientX - activeCardRect.left;
    const y = e.clientY - activeCardRect.top;

    // Only apply tilt if hover is within card boundaries
    if (x >= 0 && x <= activeCardRect.width && y >= 0 && y <= activeCardRect.height) {
        const centerX = activeCardRect.width / 2;
        const centerY = activeCardRect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 12; // max tilt 12deg
        const rotateX = -((y - centerY) / centerY) * 12;

        const cardInner = activeCardEl.querySelector('.card-inner');
        if (cardInner) {
            cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    } else {
        // Reset card-inner style if cursor leaves card
        const cardInner = activeCardEl.querySelector('.card-inner');
        if (cardInner) {
            cardInner.style.transform = '';
        }
    }
});

track.addEventListener('mouseleave', () => {
    if (isStoryMode) return; // Guard
    if (isAutoplay) {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextCard, paramAutoplay * 1000);
    }
    activeCardRect = null;
    const activeCardEl = document.querySelector('.card.active');
    if (activeCardEl) {
        const cardInner = activeCardEl.querySelector('.card-inner');
        if (cardInner) {
            cardInner.style.transform = '';
        }
    }
});

// Autoplay functionality
function startAutoplay() {
    isAutoplay = true;
    playIcon.classList.add('hidden');
    pauseIcon.classList.remove('hidden');
    if (autoplayInterval) clearInterval(autoplayInterval);
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

// Toggle control drawer
btnTogglePanel.addEventListener('click', () => {
    if (isStoryMode) return; // Guard
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

// Bind Glow slider input listener
sliderGlow.addEventListener('input', (e) => {
    paramGlow = parseFloat(e.target.value);
    valGlow.textContent = paramGlow.toFixed(2);
    ambientBg.style.opacity = paramGlow;
});

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

// Render Image list in Settings Panel
function renderImageList() {
    imageList.innerHTML = '';
    cards.forEach((card, index) => {
        const li = document.createElement('li');
        li.className = 'image-item';
        li.innerHTML = `
            <img src="${escapeHTML(card.src)}" alt="${escapeHTML(card.title)}" class="image-item-thumb">
            <div class="image-item-info">
                <div class="image-item-title">${escapeHTML(card.title)}</div>
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
    if (!confirm('Are you sure you want to remove this image?')) return;

    if (cards.length <= 1) {
        alert('At least one image must be kept in the gallery!');
        return;
    }
    cards.splice(index, 1);
    
    // Update activeIndex if it exceeds bounds or matches deleted index
    if (activeIndex >= cards.length) {
        activeIndex = cards.length - 1;
    }
    
    activeCardRect = null;
    renderCards();
    renderImageList();
}

// URL Input submit handler
urlUploadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const src = document.getElementById('url-input').value;
    const title = document.getElementById('title-input').value || 'Unlabeled Card';
    
    // Extract a random dominant-looking ambient color based on current colors
    const randomColor = AMBIENT_COLORS[Math.floor(Math.random() * AMBIENT_COLORS.length)];

    const newCard = {
        id: Date.now(),
        src: src,
        title: title,
        desc: 'A user submitted custom network image added to the dynamic cover flow carousel stack.',
        color: randomColor,
        location: 'Internet',
        camera: 'Unknown Source'
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
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
        alert('File size exceeds the 5MB limit. Please upload a smaller image.');
        fileInput.value = '';
        return;
    }

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const src = e.target.result;
            const title = file.name.split('.')[0] || 'Local Image';

            const randomColor = AMBIENT_COLORS[Math.floor(Math.random() * AMBIENT_COLORS.length)];

            const newCard = {
                id: Date.now(),
                src: src,
                title: title,
                desc: `Uploaded file: ${file.name} (type: ${file.type}, size: ${(file.size / 1024).toFixed(1)}KB) displayed on 3D Cover Flow layout.`,
                color: randomColor,
                location: 'Local Upload',
                camera: 'Unknown Camera'
            };

            cards.push(newCard);
            activeIndex = cards.length - 1;

            renderCards();
            renderImageList();
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file!');
    }
}

// Init Event Listeners for Nav buttons
btnPrev.addEventListener('click', () => {
    if (isStoryMode) return;
    prevCard();
    resetAutoplay();
});
btnNext.addEventListener('click', () => {
    if (isStoryMode) return;
    nextCard();
    resetAutoplay();
});

// Bind Back to Gallery button click listener
btnBackToGallery.addEventListener('click', exitStoryMode);

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
    }
}

// Search photos on Pexels API
async function searchPexels() {
    const query = pexelsQueryInput.value.trim();
    if (!query) return;

    pexelsSearchStatus.textContent = 'Searching Pexels...';
    pexelsSearchStatus.classList.remove('hidden');
    pexelsSearchResults.innerHTML = '';
    
    // Disable to prevent race conditions
    btnPexelsSearch.disabled = true;
    pexelsQueryInput.disabled = true;

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
    } finally {
        // Re-enable inputs
        btnPexelsSearch.disabled = false;
        pexelsQueryInput.disabled = false;
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

// Init render on window load
window.addEventListener('DOMContentLoaded', () => {
    renderCards();
    renderImageList();
    loadPexelsCurated();
});
