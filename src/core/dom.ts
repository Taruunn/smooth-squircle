/**
 * DOM Helpers for Vanilla JavaScript usage
 * 
 * These utilities allow using smooth-squircle without React.
 */

import { getSquirclePath, supportsClipPath, hasResizeObserver } from './squircle-path';

export interface ApplySquircleOptions {
    /** Corner radius in pixels */
    radius: number;
    /** Border width in pixels (optional) */
    borderWidth?: number;
    /** Border color - any CSS color (optional) */
    borderColor?: string;
}

export interface SquircleStyles {
    position: string;
    clipPath?: string;
    WebkitClipPath?: string;
    borderRadius?: string;
    overflow?: string;
}

/**
 * Creates CSS styles object for a squircle.
 * Use this when you want to manually apply styles.
 * 
 * @example
 * ```js
 * const styles = createSquircleStyles(100, 100, { radius: 20 });
 * Object.assign(element.style, styles);
 * ```
 */
export function createSquircleStyles(
    width: number,
    height: number,
    options: ApplySquircleOptions
): SquircleStyles {
    const { radius } = options;
    const isSupported = supportsClipPath();

    if (isSupported && width > 0 && height > 0) {
        const pathData = getSquirclePath(width, height, radius);
        return {
            position: 'relative',
            clipPath: `path('${pathData}')`,
            WebkitClipPath: `path('${pathData}')`,
        };
    }

    // Fallback
    return {
        position: 'relative',
        borderRadius: `${radius}px`,
        overflow: 'hidden',
    };
}

/**
 * Applies squircle styling to a DOM element.
 * Automatically handles resize updates via ResizeObserver.
 * 
 * @returns A cleanup function to disconnect the observer
 * 
 * @example
 * ```js
 * const element = document.getElementById('my-card');
 * const cleanup = applySquircle(element, { radius: 20 });
 * 
 * // Later, to stop observing:
 * cleanup();
 * ```
 */
export function applySquircle(
    element: HTMLElement,
    options: ApplySquircleOptions
): () => void {
    const { radius, borderWidth = 0, borderColor = 'currentColor' } = options;
    const isSupported = supportsClipPath();

    let svgOverlay: SVGSVGElement | null = null;

    const updateStyles = () => {
        const { offsetWidth, offsetHeight } = element;

        if (offsetWidth === 0 || offsetHeight === 0) return;

        if (isSupported) {
            const pathData = getSquirclePath(offsetWidth, offsetHeight, radius);
            element.style.position = 'relative';
            element.style.clipPath = `path('${pathData}')`;
            (element.style as any).WebkitClipPath = `path('${pathData}')`;

            // Handle border with SVG overlay
            if (borderWidth > 0) {
                if (!svgOverlay) {
                    svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svgOverlay.setAttribute('aria-hidden', 'true');
                    svgOverlay.style.cssText = `
                        position: absolute;
                        top: ${-borderWidth / 2}px;
                        left: ${-borderWidth / 2}px;
                        width: calc(100% + ${borderWidth}px);
                        height: calc(100% + ${borderWidth}px);
                        pointer-events: none;
                        z-index: 10;
                    `;
                    element.appendChild(svgOverlay);
                }

                svgOverlay.innerHTML = `
                    <path 
                        d="${pathData}" 
                        fill="none" 
                        stroke="${borderColor}" 
                        stroke-width="${borderWidth * 2}"
                        vector-effect="non-scaling-stroke"
                        style="transform: translate(${borderWidth / 2}px, ${borderWidth / 2}px)"
                    />
                `;
            }
        } else {
            // Fallback
            element.style.position = 'relative';
            element.style.borderRadius = `${radius}px`;
            element.style.overflow = 'hidden';

            if (borderWidth > 0) {
                element.style.border = `${borderWidth}px solid ${borderColor}`;
            }
        }
    };

    // Initial update
    updateStyles();

    // Setup resize observer
    let observer: ResizeObserver | null = null;
    if (hasResizeObserver()) {
        observer = new ResizeObserver(updateStyles);
        observer.observe(element);
    }

    // Also listen to window resize as fallback
    window.addEventListener('resize', updateStyles);

    // Return cleanup function
    return () => {
        observer?.disconnect();
        window.removeEventListener('resize', updateStyles);
        if (svgOverlay && svgOverlay.parentNode) {
            svgOverlay.parentNode.removeChild(svgOverlay);
        }
    };
}
