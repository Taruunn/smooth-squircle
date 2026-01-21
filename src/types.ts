import React from 'react';

/**
 * Responsive radius configuration
 */
export interface ResponsiveRadius {
    /** Radius for mobile viewports (default: <= 769px) */
    mobile: number;
    /** Radius for desktop viewports */
    desktop: number;
}

/**
 * Props for the Squircle component
 */
export interface SquircleProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;

    /**
     * Corner radius in pixels.
     * Can be a single number or responsive object.
     * @default { mobile: 30, desktop: 40 }
     * @example
     * radius={20}
     * radius={{ mobile: 16, desktop: 24 }}
     */
    radius?: number | ResponsiveRadius;

    /**
     * Width of the border in pixels.
     * Border follows the squircle path perfectly.
     * @default 0
     */
    borderWidth?: number;

    /**
     * Color of the border.
     * Accepts any valid CSS color value.
     * @default "currentColor"
     */
    borderColor?: string;

    /**
     * Additional CSS class names
     */
    className?: string;

    /**
     * The HTML element to render as.
     * @default "div"
     * @example as="button", as="a", as="section"
     */
    as?: React.ElementType;

    /**
     * Mobile breakpoint in pixels for responsive radius.
     * @default 769
     */
    mobileBreakpoint?: number;

    // Common attributes for interactive elements
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    href?: string;
    target?: string;
    rel?: string;
}

/**
 * Return type for useSquircle hook
 */
export interface UseSquircleReturn {
    /** Ref to attach to the container element */
    ref: React.RefObject<HTMLElement>;
    /** The generated SVG path data */
    pathData: string;
    /** Current resolved radius value */
    currentRadius: number;
    /** Whether clip-path is supported */
    isSupported: boolean;
    /** Whether client-side hydration is complete */
    isHydrated: boolean;
    /** Computed styles to apply */
    style: React.CSSProperties;
}

/**
 * Options for useSquircle hook
 */
export interface UseSquircleOptions {
    radius?: number | ResponsiveRadius;
    mobileBreakpoint?: number;
}
