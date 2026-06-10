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
});
btnNext.addEventListener('click', () => {
    nextCard();
});

// Init render on window load
window.addEventListener('DOMContentLoaded', () => {
    renderCards();
});
