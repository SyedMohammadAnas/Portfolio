# Welcome Portfolio Text Component

A reusable React component that creates an animated welcome text effect for portfolio websites, extracted from a Next.js portfolio project.

## Features

- **Interactive Text Effects**: Uses TextModifier component for hover-based font weight and scaling animations
- **Responsive Design**: Automatically hides on mobile devices (configurable)
- **Customizable**: Props for text content, styling, and animation parameters
- **Fixed Positioning**: Centered overlay with viewport-relative positioning

## Implementation Details

### Core Components Used
- **TextModifier**: Custom component for interactive text animations
- **Framer Motion**: For smooth animations and hover effects
- **Responsive Positioning**: Uses viewport units (vh) for consistent scaling

### Key Techniques
1. **Fixed Positioning**: `fixed inset-0` with flexbox centering
2. **Viewport Units**: `pxToVh()` for responsive positioning across devices
3. **Text Shadows**: Multiple layered shadows for depth and readability
4. **Conditional Rendering**: Mobile detection with `window.innerWidth` check
5. **Z-index Management**: High z-index for overlay positioning

### Animation Parameters
- **Font Weight**: Dynamic scaling from 400 to 900 on hover
- **Scale**: Up to 1.3x scaling with proximity detection
- **Offset**: Text movement up to 5px (15px for title)
- **Proximity Radius**: 100px detection area for hover effects

## Usage

```tsx
import WelcomeText from './components/WelcomeText';

// Basic usage
<WelcomeText />

// Custom text and settings
<WelcomeText
  welcomeText="hello world"
  titleText="MY SITE"
  showOnMobile={true}
  maxScale={1.5}
  proximityRadius={150}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showOnMobile` | boolean | false | Show component on mobile devices |
| `topMarginAdjustment` | number | -72 | Top margin adjustment in pixels |
| `welcomeText` | string | "welcome to my" | Welcome text content |
| `titleText` | string | "PORTFOLIO." | Main title text content |
| `baseWeight` | number | 400 | Base font weight |
| `maxWeight` | number | 900 | Maximum font weight on hover |
| `maxScale` | number | 1.3 | Maximum scale factor |
| `maxOffset` | number | 5 | Maximum text offset |
| `animationSpeed` | number | 0.2 | Animation transition speed |
| `proximityRadius` | number | 100 | Hover detection radius |

## Dependencies

- React
- TextModifier component
- `pxToVh` utility function
- Tailwind CSS classes

## Notes

- Component uses `pointer-events-none` to avoid blocking interactions
- Text shadows are layered for better contrast against background images
- Mobile detection is basic (width < 768px) - can be enhanced with custom hooks
- Positioned as fixed overlay, so ensure proper z-index in parent containers
