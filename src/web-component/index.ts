/**
 * Smooth Squircle Web Component
 * 
 * A custom element that applies iOS-style squircle corners.
 * Works in any framework or vanilla HTML.
 * 
 * @example
 * ```html
 * <smooth-squircle radius="20" border-width="2" border-color="#3b82f6">
 *   <img src="avatar.jpg" alt="Avatar" />
 * </smooth-squircle>
 * ```
 */

import { getSquirclePath, supportsClipPath, hasResizeObserver } from '../core';

export class SmoothSquircleElement extends HTMLElement {
    private observer: ResizeObserver | null = null;
    private svgOverlay: SVGSVGElement | null = null;
    private isSupported: boolean;

    static get observedAttributes(): string[] {
        return ['radius', 'border-width', 'border-color'];
    }

    constructor() {
        super();
        this.isSupported = supportsClipPath();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        this.render();
        this.updateSquircle();

        // Setup resize observer
        if (hasResizeObserver()) {
            this.observer = new ResizeObserver(() => this.updateSquircle());
            this.observer.observe(this);
        }

        window.addEventListener('resize', this.handleResize);
    }

    disconnectedCallback(): void {
        this.observer?.disconnect();
        window.removeEventListener('resize', this.handleResize);
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue !== newValue) {
            this.updateSquircle();
        }
    }

    private handleResize = (): void => {
        this.updateSquircle();
    };

    private get radius(): number {
        return Number(this.getAttribute('radius')) || 20;
    }

    private get borderWidth(): number {
        return Number(this.getAttribute('border-width')) || 0;
    }

    private get borderColor(): string {
        return this.getAttribute('border-color') || 'currentColor';
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                }
                .content {
                    width: 100%;
                    height: 100%;
                }
                .border-overlay {
                    position: absolute;
                    pointer-events: none;
                    z-index: 10;
                }
            </style>
            <div class="content">
                <slot></slot>
            </div>
        `;
    }

    private updateSquircle(): void {
        const { offsetWidth, offsetHeight } = this;

        if (offsetWidth === 0 || offsetHeight === 0) return;

        if (this.isSupported) {
            const pathData = getSquirclePath(offsetWidth, offsetHeight, this.radius);
            this.style.clipPath = `path('${pathData}')`;
            (this.style as any).WebkitClipPath = `path('${pathData}')`;

            // Handle border
            if (this.borderWidth > 0 && this.shadowRoot) {
                this.updateBorderOverlay(pathData);
            } else {
                this.removeBorderOverlay();
            }
        } else {
            // Fallback mode
            this.style.borderRadius = `${this.radius}px`;
            this.style.overflow = 'hidden';

            if (this.borderWidth > 0) {
                this.style.border = `${this.borderWidth}px solid ${this.borderColor}`;
            }
        }
    }

    private updateBorderOverlay(pathData: string): void {
        if (!this.shadowRoot) return;

        if (!this.svgOverlay) {
            this.svgOverlay = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            this.svgOverlay.classList.add('border-overlay');
            this.svgOverlay.setAttribute('aria-hidden', 'true');
            this.shadowRoot.appendChild(this.svgOverlay);
        }

        // Adjust SVG size to account for border width
        const bw = this.borderWidth;
        this.svgOverlay.style.top = `${-bw / 2}px`;
        this.svgOverlay.style.left = `${-bw / 2}px`;
        this.svgOverlay.style.width = `calc(100% + ${bw}px)`;
        this.svgOverlay.style.height = `calc(100% + ${bw}px)`;

        this.svgOverlay.innerHTML = `
            <path 
                d="${pathData}" 
                fill="none" 
                stroke="${this.borderColor}" 
                stroke-width="${this.borderWidth * 2}"
                vector-effect="non-scaling-stroke"
                style="transform: translate(${bw / 2}px, ${bw / 2}px)"
            />
        `;
    }

    private removeBorderOverlay(): void {
        if (this.svgOverlay && this.shadowRoot) {
            this.shadowRoot.removeChild(this.svgOverlay);
            this.svgOverlay = null;
        }
    }
}

/**
 * Register the custom element.
 * Call this function to make <smooth-squircle> available.
 * 
 * @example
 * ```js
 * import { registerSmoothSquircle } from 'smooth-squircle/web-component';
 * registerSmoothSquircle();
 * 
 * // Now you can use:
 * // <smooth-squircle radius="20">Content</smooth-squircle>
 * ```
 */
export function registerSmoothSquircle(tagName = 'smooth-squircle'): void {
    if (typeof customElements !== 'undefined' && !customElements.get(tagName)) {
        customElements.define(tagName, SmoothSquircleElement);
    }
}

// Auto-register if in browser environment
if (typeof window !== 'undefined' && typeof customElements !== 'undefined') {
    // Use queueMicrotask to allow consumers to prevent auto-registration
    queueMicrotask(() => {
        if (!customElements.get('smooth-squircle')) {
            registerSmoothSquircle();
        }
    });
}
