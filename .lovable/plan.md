

# Cyber-Premium TicTacToe

## Pages & Flow

### 1. Landing Page (Hero Section)
- Dark, immersive hero with bold headline: "The World's Most Intelligent TicTacToe Robot"
- Glassmorphism card with neon cyan/purple accents
- Animated grid background pattern
- CTA button to start playing

### 2. Grid Selection Screen
- Four glassmorphic cards for 3×3, 5×5, 9×9, 15×15
- Hover glow effects with neon accents
- Smooth fade-in animations

### 3. Dynamic Game Board
- CSS Grid generated based on selected size
- Each cell is clickable, calling `handleCellClick(index)` with 0-based indexing
- Hover glow effects on cells, X/O rendered with neon styling
- Turn indicator and reset button
- Glassmorphic board container with subtle border glow

## Design System
- **Dark mode** base with deep navy/black backgrounds
- **Glassmorphism**: backdrop-blur, semi-transparent backgrounds
- **Neon accents**: Cyan (#00f0ff) and purple (#a855f7) glows
- **Typography**: Bold, large headings with gradient text effects
- **Animations**: Smooth page transitions, cell hover effects, piece placement animations using CSS keyframes

## Components
- `HeroSection` — marketing landing with CTA
- `GridSelector` — grid size picker cards
- `GameBoard` — dynamic CSS grid with clickable cells
- `GameCell` — individual cell with hover/click effects
- State management via React useState for game flow (hero → select → play)

