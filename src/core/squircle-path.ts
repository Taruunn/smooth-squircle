/**
 * Smooth Squircle - Core Path Generation
 * 
 * Based on Apple's design parameters for iOS-style smooth corners.
 * These Bezier control points create optically correct squircle curves
 * that match iPhone app icon smoothness.
 */

/**
 * Apple's Bezier approximation for squircle corners.
 * Each sub-array contains 3 control points for a cubic Bezier curve segment.
 */
export const squircleBezierApproximation: readonly [number, number][][] = [
    [[0.3, 0], [0.473, 0], [0.619, 0.039]],
    [[0.804, 0.088], [0.912, 0.196], [0.961, 0.381]],
    [[1, 0.527], [1, 0.7], [1, 1]],
];

// Vector math utilities
const vecAdd = (v1: [number, number], v2: [number, number]): [number, number] =>
    [v1[0] + v2[0], v1[1] + v2[1]];

const vecMul = (v: [number, number], k: number): [number, number] =>
    [v[0] * k, v[1] * k];

function rotBy90(v: [number, number], k: number): [number, number] {
    const [x, y] = v;
    switch (k % 4) {
        case 0: return [x, y];
        case 1: return [y, -x];
        case 2: return [-x, -y];
        case 3: return [-y, x];
        default: return [x, y];
    }
}

export interface SquirclePathOptions {
    /** Width of the squircle in pixels */
    width: number;
    /** Height of the squircle in pixels */
    height: number;
    /** Corner radius in pixels. Will be clamped to half the smallest dimension. */
    radius: number;
}

/**
 * Generates an SVG path string for a squircle rectangle.
 * 
 * @example
 * ```ts
 * const path = getSquirclePath({ width: 100, height: 100, radius: 20 });
 * // Use with clip-path: path('...')
 * ```
 * 
 * @param options - The dimensions and radius for the squircle
 * @returns SVG path data string, or empty string if dimensions are 0
 */
export function getSquirclePath(options: SquirclePathOptions): string;
export function getSquirclePath(width: number, height: number, radius: number): string;
export function getSquirclePath(
    widthOrOptions: number | SquirclePathOptions,
    height?: number,
    radius?: number
): string {
    let w: number, h: number, r: number;

    if (typeof widthOrOptions === 'object') {
        w = widthOrOptions.width;
        h = widthOrOptions.height;
        r = widthOrOptions.radius;
    } else {
        w = widthOrOptions;
        h = height!;
        r = radius!;
    }

    if (w === 0 || h === 0) return '';

    // Ensure radius isn't larger than half the smallest side
    const clampedRadius = Math.min(r, w / 2, h / 2);

    const left = 0;
    const top = 0;
    const right = w;
    const bottom = h;

    let path = `M ${left + clampedRadius} ${top}`;

    // Top Right corner
    const startTR: [number, number] = [right - clampedRadius, top];
    path += ` L ${startTR[0]} ${startTR[1]}`;
    for (const [cA, cB, target] of squircleBezierApproximation) {
        const cA2 = vecAdd(startTR, vecMul(rotBy90(cA as [number, number], 0), clampedRadius));
        const cB2 = vecAdd(startTR, vecMul(rotBy90(cB as [number, number], 0), clampedRadius));
        const t2 = vecAdd(startTR, vecMul(rotBy90(target as [number, number], 0), clampedRadius));
        path += ` C ${cA2[0]} ${cA2[1]}, ${cB2[0]} ${cB2[1]}, ${t2[0]} ${t2[1]}`;
    }

    // Bottom Right corner
    const startBR: [number, number] = [right, bottom - clampedRadius];
    path += ` L ${startBR[0]} ${startBR[1]}`;
    for (const [cA, cB, target] of squircleBezierApproximation) {
        const cA2 = vecAdd(startBR, vecMul(rotBy90(cA as [number, number], 3), clampedRadius));
        const cB2 = vecAdd(startBR, vecMul(rotBy90(cB as [number, number], 3), clampedRadius));
        const t2 = vecAdd(startBR, vecMul(rotBy90(target as [number, number], 3), clampedRadius));
        path += ` C ${cA2[0]} ${cA2[1]}, ${cB2[0]} ${cB2[1]}, ${t2[0]} ${t2[1]}`;
    }

    // Bottom Left corner
    const startBL: [number, number] = [left + clampedRadius, bottom];
    path += ` L ${startBL[0]} ${startBL[1]}`;
    for (const [cA, cB, target] of squircleBezierApproximation) {
        const cA2 = vecAdd(startBL, vecMul(rotBy90(cA as [number, number], 2), clampedRadius));
        const cB2 = vecAdd(startBL, vecMul(rotBy90(cB as [number, number], 2), clampedRadius));
        const t2 = vecAdd(startBL, vecMul(rotBy90(target as [number, number], 2), clampedRadius));
        path += ` C ${cA2[0]} ${cA2[1]}, ${cB2[0]} ${cB2[1]}, ${t2[0]} ${t2[1]}`;
    }

    // Top Left corner
    const startTL: [number, number] = [left, top + clampedRadius];
    path += ` L ${startTL[0]} ${startTL[1]}`;
    for (const [cA, cB, target] of squircleBezierApproximation) {
        const cA2 = vecAdd(startTL, vecMul(rotBy90(cA as [number, number], 1), clampedRadius));
        const cB2 = vecAdd(startTL, vecMul(rotBy90(cB as [number, number], 1), clampedRadius));
        const t2 = vecAdd(startTL, vecMul(rotBy90(target as [number, number], 1), clampedRadius));
        path += ` C ${cA2[0]} ${cA2[1]}, ${cB2[0]} ${cB2[1]}, ${t2[0]} ${t2[1]}`;
    }

    path += ' Z';
    return path;
}

/**
 * Generates a complete SVG string for a squircle shape.
 * Useful for generating mask images or standalone SVG files.
 */
export function getSquircleSVG(width: number, height: number, radius: number): string {
    const path = getSquirclePath(width, height, radius);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><path d="${path}" fill="black" /></svg>`;
}

/**
 * Generates a Data URI for a squircle SVG mask.
 * Can be used with CSS mask-image property.
 */
export function getSquircleDataUri(width: number, height: number, radius: number): string {
    const svg = getSquircleSVG(width, height, radius);
    // Use encodeURIComponent for better compatibility than btoa
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Checks if the browser supports clip-path: path()
 * Returns false on server-side or unsupported browsers.
 */
export function supportsClipPath(): boolean {
    if (typeof window === 'undefined') return false;
    if (typeof CSS === 'undefined' || !CSS.supports) return false;
    try {
        return CSS.supports('clip-path', 'path("M0 0")');
    } catch {
        return false;
    }
}

/**
 * Checks if ResizeObserver is available
 */
export function hasResizeObserver(): boolean {
    return typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined';
}
