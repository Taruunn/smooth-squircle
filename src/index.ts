// React component and hook
export { Squircle } from './react/Squircle';
export { useSquircle } from './react/useSquircle';

// Core utilities (framework-agnostic)
export {
    getSquirclePath,
    getSquircleSVG,
    getSquircleDataUri,
    squircleBezierApproximation,
    supportsClipPath,
    hasResizeObserver,
    applySquircle,
    createSquircleStyles,
} from './core';

// Types
export type {
    SquircleProps,
    ResponsiveRadius,
    UseSquircleReturn,
    UseSquircleOptions,
} from './types';

// Core types
export type { SquirclePathOptions } from './core';

