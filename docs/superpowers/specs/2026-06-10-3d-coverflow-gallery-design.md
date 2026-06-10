# 3D Cover Flow Immersive Gallery - Design Specification

This document outlines the architecture, design choices, and technical implementation plan for a premium, single-page 3D Cover Flow photo gallery built using native Web technologies.

## Goal Description
Build a visual gallery webpage styled as a high-end photography exhibition, featuring a 3D Cover Flow scrolling track of images. The project prioritizes rich aesthetics, fluid interactions, responsive design, and local configuration control without using external libraries (except standard icon sets if needed).

---

## Technical Architecture

The application is structured as a standard Frontend web page containing three primary modules:
1. **HTML Structure (`index.html`)**: Declares the DOM tree for the fullscreen container, cover flow track, interactive control panels, and the file-upload/custom-URL input form.
2. **Styling System (`styles.css`)**: Implements standard global design tokens, CSS variables, glassmorphism styles, reflection properties (`-webkit-box-reflect`), 3D transforms, and perspective settings.
3. **Gallery Engine (`app.js`)**: Implements standard state management, dynamic card coordinate calculations (angles, depth translations), drag-to-scroll interaction, inertia calculations, autoplay loops, card detail flipping, and customized theme loading.

### Directory Structure
```
z:/VibeCoding/A/
├── index.html
├── styles.css
├── app.js
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-06-10-3d-coverflow-gallery-design.md (This file)
```

---

## Detailed Components

### 1. Viewport & Background System
- **Layout**: `100vh` fullscreen with no page scrolling (`overflow: hidden`).
- **Ambient Lighting**: CSS radial gradients matching the color profile of the active card. A dynamic transition applies when cards switch.
- **Glassmorphism Containers**: Control drawers, sidebars, and tags utilize `backdrop-filter: blur(20px)` and semi-transparent white/black borders to present a premium feel.

### 2. 3D Cover Flow Track
- **3D Space Setup**:
  - Parent container: `perspective: 1000px` and `perspective-origin: 50% 50%`.
  - Track element: `transform-style: preserve-3d` to project cards into 3D.
- **Card Calculation (Mathematical Projection)**:
  - For each card at index `i` relative to the active card `activeIndex`:
    - `offset = i - activeIndex`
    - Rotation: `rotateY = clamp(offset * -angle, -maxAngle, maxAngle)`
    - Translation X: `translateX = offset * spacing + Math.sign(offset) * spacingOffset`
    - Translation Z: `translateZ = -Math.abs(offset) * depthOffset`
    - Scaling: `scale = Math.pow(scaleFactor, Math.abs(offset))`
    - Blur: `filter = Math.abs(offset) > 0 ? "blur(" + Math.abs(offset) * blurFactor + "px)" : "none"`
    - Opacity: `opacity = Math.max(0.2, 1 - Math.abs(offset) * opacityStep)`
- **Hover Tilt (3D Parallax)**:
  - Mouse move on the active card calculates the normalized coordinates `(x, y)` relative to the card's center.
  - Applies a dynamic transform `rotateY(x * tiltAmount) rotateX(-y * tiltAmount)` to tilt the card towards the cursor.

### 3. Navigation & Event Handlers
- **Drag Interaction**: Tracks mouse/touch start, move, and end events.
  - Updates track translation offset during movement.
  - Computes velocity at release to execute smooth inertia decay using `requestAnimationFrame`.
- **Keyboard & Scroll**: Arrow keys and mousewheel triggers navigation to the previous/next card.
- **Autoplay Loop**: Custom interval timer to rotate cards. Pauses on user drag/hover interactions.

### 4. Custom Configuration & Data Panel (Control Drawer)
- **Settings Controls (Inputs/Sliders)**:
  - Slide Spacing (spacing factor)
  - Cover Angle (3D rotation angle)
  - Z-Depth Offset (translation Z depth)
  - Autoplay Speed (seconds per slide, or toggle autoplay off)
- **Image List Manager**:
  - UI list showing current items.
  - Click to remove items or drag to change order.
  - **Local Add**: File upload (converts image files to object URLs using `URL.createObjectURL`).
  - **Remote Add**: Text input field to enter web image URLs.

---

## Verification Plan

### Automated Verification
- Run code syntax checks via node validation if needed.
- Monitor console outputs during execution to ensure no error logs or layout thrashing occurs during dragging.

### Manual Verification
- **Drag Performance**: Verify that rotation is smooth (at or near 60fps) under rapid mouse dragging.
- **Settings Adjustments**: Test sliding controls (angle, spacing, depth) to confirm that 3D rendering updates live without glitching.
- **Upload Functionality**: Drag and drop a local image file and ensure it registers instantly as a card in the Cover Flow carousel.
- **Flipping Behavior**: Click the active card to ensure it flips 180 degrees seamlessly to show card text metadata on the back.
