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
let cardEls = [];
let dotEls = [];

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
                    <button class="btn-flip-back">BACK TO GALLERY</button>
                </div>
            </div>
        `;

        // Flip back event
        const flipBackBtn = cardEl.querySelector('.btn-flip-back');
        flipBackBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            flipCard(index, false);
        });

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

    cardEls = document.querySelectorAll('.card');

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
    dotEls = document.querySelectorAll('.dot');
}

// Calculate and Apply 3D Projections dynamically
function updateCoverflow() {
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
        dotEls.forEach((dot, idx) => {
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

// Drag & Swipe Interaction State
let isDragging = false;
let startX = 0;
let currentX = 0;
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
