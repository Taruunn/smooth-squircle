// Core exports - framework agnostic
export {
    getSquirclePath,
    getSquircleSVG,
    getSquircleDataUri,
    squircleBezierApproximation,
    supportsClipPath,
    hasResizeObserver,
    type SquirclePathOptions,
} from './squircle-path';

// DOM helpers for vanilla JavaScript
export {
    applySquircle,
    createSquircleStyles,
    type ApplySquircleOptions,
    type SquircleStyles,
} from './dom';
