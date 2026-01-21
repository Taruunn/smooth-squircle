# smooth-squircle

> iOS-style squircle corners for React with smart fallback. Works on mobile browsers, iOS Safari, and all modern platforms.

[![npm version](https://img.shields.io/npm/v/smooth-squircle.svg)](https://www.npmjs.com/package/smooth-squircle)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/smooth-squircle)](https://bundlephobia.com/package/smooth-squircle)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why This Library?

Standard CSS `border-radius` creates **circular arcs**, not true squircles. Apple's iOS uses **superellipse curves** (squircles) for app icons, and this library replicates that exact visual quality.

**Unlike other squircle libraries, `smooth-squircle`:**

- ✅ **Smart Fallback**: Gracefully degrades to `border-radius` on unsupported browsers (mobile WebView, older Safari)
- ✅ **Apple-Quality Curves**: Uses Apple's exact Bezier control points for pixel-perfect squircles
- ✅ **Responsive Radius**: Built-in support for different mobile/desktop radii
- ✅ **SVG Border Support**: Borders follow the squircle path perfectly
- ✅ **Tiny Bundle**: ~1.5KB gzipped (core), tree-shakeable
- ✅ **TypeScript**: Full type safety out of the box

## Installation

```bash
npm install smooth-squircle
# or
yarn add smooth-squircle
# or
pnpm add smooth-squircle
```

## Quick Start

```tsx
import { Squircle } from "smooth-squircle";

function App() {
  return (
    <Squircle radius={20} className="card">
      <img src="avatar.jpg" alt="Avatar" />
    </Squircle>
  );
}
```

## Usage Examples

### Basic Usage

```tsx
<Squircle radius={24}>
  <div className="card">
    <h2>Card Title</h2>
    <p>Card content goes here</p>
  </div>
</Squircle>
```

### Responsive Radius

Different corner radius for mobile and desktop:

```tsx
<Squircle radius={{ mobile: 16, desktop: 32 }}>
  <div className="hero-image">
    <img src="hero.jpg" />
  </div>
</Squircle>
```

### With Border

Borders follow the squircle path perfectly:

```tsx
<Squircle radius={20} borderWidth={2} borderColor="#3b82f6">
  <div className="outlined-card">Content</div>
</Squircle>
```

### As Different Element

Render as any HTML element:

```tsx
<Squircle as="button" type="button" radius={12} onClick={handleClick}>
  Click Me
</Squircle>

<Squircle as="button" type="submit" radius={12}>
  Submit Form
</Squircle>

<Squircle as="a" radius={16} href="/about">
  Learn More
</Squircle>
```

### Using the Hook

For advanced control, use the `useSquircle` hook:

```tsx
import { useSquircle } from "smooth-squircle";

function CustomCard() {
  const { ref, style, isSupported, pathData } = useSquircle({
    radius: { mobile: 16, desktop: 24 },
  });

  return (
    <div ref={ref} style={style}>
      {isSupported ? "Using clip-path!" : "Using fallback"}
    </div>
  );
}
```

### Framework-Agnostic Core

Use the path generation directly (works with any framework):

```ts
import { getSquirclePath, supportsClipPath } from "smooth-squircle/core";

// Generate SVG path data
const pathData = getSquirclePath({ width: 100, height: 100, radius: 20 });

// Use in vanilla JS
if (supportsClipPath()) {
  element.style.clipPath = `path('${pathData}')`;
} else {
  element.style.borderRadius = "20px";
}
```

### Form Elements (Wrapper Pattern)

⚠️ **Important:** Elements like `<input>`, `<textarea>`, and `<select>` don't support `clip-path` directly. You must wrap them:

```tsx
// ✅ CORRECT - Wrap form elements
<Squircle radius={12} className="input-wrapper">
  <input
    type="text"
    placeholder="Enter text..."
    style={{
      width: '100%',
      background: 'transparent',
      border: 'none',
      padding: '12px 16px',
    }}
  />
</Squircle>

// ❌ WRONG - This won't work
<Squircle as="input" radius={12} />
```

**Why?** Form controls have browser-native rendering that `clip-path` can't mask. The wrapper provides the visual squircle shape while the input fills it.

### Web Component

For use in any HTML page without a framework:

```html
<script type="module">
  import "smooth-squircle/web-component";
</script>

<smooth-squircle radius="20" border-width="2" border-color="#3b82f6">
  <img src="avatar.jpg" alt="Profile" />
</smooth-squircle>
```

### Vanilla JavaScript

```js
import { applySquircle } from "smooth-squircle/core";

const el = document.querySelector(".my-card");
const cleanup = applySquircle(el, {
  radius: 24,
  borderWidth: 2,
  borderColor: "#6366f1",
});

// Later, to remove:
cleanup();
```

## API Reference

### `<Squircle>` Component

| Prop               | Type                                            | Default                       | Description                                 |
| ------------------ | ----------------------------------------------- | ----------------------------- | ------------------------------------------- |
| `radius`           | `number \| { mobile: number; desktop: number }` | `{ mobile: 30, desktop: 40 }` | Corner radius in pixels                     |
| `borderWidth`      | `number`                                        | `0`                           | Border width in pixels                      |
| `borderColor`      | `string`                                        | `"currentColor"`              | Border color (any CSS color)                |
| `as`               | `React.ElementType`                             | `"div"`                       | HTML element to render                      |
| `mobileBreakpoint` | `number`                                        | `769`                         | Breakpoint for responsive radius            |
| `className`        | `string`                                        | `""`                          | CSS class names                             |
| `style`            | `React.CSSProperties`                           | `undefined`                   | Inline styles (merged with squircle styles) |

Plus all standard HTML attributes for the rendered element.

### `useSquircle(options)` Hook

**Options:**

- `radius`: Same as component prop
- `mobileBreakpoint`: Same as component prop

**Returns:**

- `ref`: Ref to attach to your element
- `style`: Computed styles to apply
- `pathData`: Generated SVG path string
- `currentRadius`: Resolved radius value
- `isSupported`: Whether `clip-path: path()` is supported
- `isHydrated`: Whether client-side hydration is complete

### Core Functions

```ts
// Generate SVG path
getSquirclePath(width, height, radius): string
getSquirclePath({ width, height, radius }): string

// Generate complete SVG
getSquircleSVG(width, height, radius): string

// Generate data URI for CSS masks
getSquircleDataUri(width, height, radius): string

// Browser detection
supportsClipPath(): boolean
hasResizeObserver(): boolean
```

## Browser Support

| Browser        | Support                     |
| -------------- | --------------------------- |
| Chrome         | ✅ Full squircle            |
| Firefox        | ✅ Full squircle            |
| Safari 15+     | ✅ Full squircle            |
| Safari 14      | ⚠️ Fallback (border-radius) |
| iOS Safari 15+ | ✅ Full squircle            |
| Edge           | ✅ Full squircle            |

The fallback is visually seamless - users won't notice any degradation.

## How It Works

1. **Detection**: Checks `CSS.supports('clip-path', 'path("M0 0")')` on mount
2. **Path Generation**: Uses Apple's exact Bezier control points for the superellipse
3. **Application**: Applies `clip-path: path()` on supported browsers
4. **Fallback**: Uses `border-radius` + `overflow: hidden` on unsupported browsers
5. **Resize Handling**: Uses ResizeObserver to recalculate on element resize

## Performance

- **Tree-shakeable**: Import only what you need
- **Lazy calculation**: Paths are only generated when element has dimensions
- **Memoized**: Browser support check runs once
- **ResizeObserver**: Only recalculates when element actually changes size

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Credits

- Bezier approximation based on Apple's design parameters for iOS app icons
- Inspired by the need for consistent squircle rendering across all platforms

## License

MIT © [Tarun](https://github.com/Taruunn)

---

Star this repo if it helps. Read the guide. Build something great.
