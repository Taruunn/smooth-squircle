import { useLayoutEffect, useRef, useState, useMemo, useEffect } from 'react';
import { getSquirclePath, supportsClipPath, hasResizeObserver } from '../core';
import type { UseSquircleReturn, UseSquircleOptions, ResponsiveRadius } from '../types';

const DEFAULT_RADIUS: ResponsiveRadius = { mobile: 30, desktop: 40 };
const DEFAULT_MOBILE_BREAKPOINT = 769;

/**
 * Hook for applying squircle styling to any element.
 * Provides granular control over the squircle effect.
 * 
 * @example
 * ```tsx
 * function CustomSquircle() {
 *   const { ref, style, pathData, isSupported } = useSquircle({ radius: 20 });
 *   
 *   return (
 *     <div ref={ref} style={style}>
 *       {isSupported ? 'Using clip-path!' : 'Using border-radius fallback'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSquircle(options: UseSquircleOptions = {}): UseSquircleReturn {
    const {
        radius = DEFAULT_RADIUS,
        mobileBreakpoint = DEFAULT_MOBILE_BREAKPOINT
    } = options;

    const containerRef = useRef<HTMLElement>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const [pathData, setPathData] = useState<string>('');
    const [currentRadius, setCurrentRadius] = useState<number>(
        typeof radius === 'number' ? radius : radius.desktop
    );

    // Check browser support once on mount
    const isSupported = useMemo(() => supportsClipPath(), []);

    // Mark as hydrated after mount
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    useLayoutEffect(() => {
        const updatePath = () => {
            if (!containerRef.current) return;
            const { offsetWidth, offsetHeight } = containerRef.current;

            // Skip if element has no dimensions yet
            if (offsetWidth === 0 || offsetHeight === 0) return;

            let resolvedRadius = 30;
            if (typeof radius === 'number') {
                resolvedRadius = radius;
            } else if (radius && typeof radius === 'object') {
                resolvedRadius = window.innerWidth <= mobileBreakpoint
                    ? radius.mobile
                    : radius.desktop;
            }

            setCurrentRadius(resolvedRadius);
            const path = getSquirclePath(offsetWidth, offsetHeight, resolvedRadius);
            setPathData(path);
        };

        updatePath();

        // Use ResizeObserver if available
        let observer: ResizeObserver | null = null;
        if (hasResizeObserver()) {
            observer = new ResizeObserver(updatePath);
            if (containerRef.current) {
                observer.observe(containerRef.current);
            }
        }

        window.addEventListener('resize', updatePath);

        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', updatePath);
        };
    }, [radius, mobileBreakpoint]);

    // Build styles
    const style = useMemo<React.CSSProperties>(() => {
        const baseStyle: React.CSSProperties = {
            position: 'relative',
            zIndex: 1,
        };

        if (isSupported && pathData) {
            return {
                ...baseStyle,
                clipPath: `path('${pathData}')`,
                WebkitClipPath: `path('${pathData}')`,
            };
        }

        // Fallback
        return {
            ...baseStyle,
            borderRadius: `${currentRadius}px`,
            overflow: 'hidden',
        };
    }, [isSupported, pathData, currentRadius]);

    return {
        ref: containerRef as React.RefObject<HTMLElement>,
        pathData,
        currentRadius,
        isSupported,
        isHydrated,
        style,
    };
}
