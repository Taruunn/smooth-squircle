import React, { useMemo } from 'react';
import { useSquircle } from './useSquircle';
import type { SquircleProps } from '../types';

/**
 * A wrapper component that applies iOS-style squircle corners to its children.
 * 
 * Features:
 * - True Apple-quality Bezier curves that match iPhone app icons
 * - Responsive radius support (different values for mobile/desktop)
 * - SVG border overlay that follows the squircle path
 * - Smart fallback to border-radius for unsupported browsers (Shopify mobile, older browsers)
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <Squircle radius={20}>
 *   <img src="avatar.jpg" />
 * </Squircle>
 * 
 * // Responsive radius
 * <Squircle radius={{ mobile: 16, desktop: 24 }}>
 *   <div className="card">Content</div>
 * </Squircle>
 * 
 * // With border
 * <Squircle radius={20} borderWidth={2} borderColor="#3b82f6">
 *   <button>Click me</button>
 * </Squircle>
 * 
 * // As different element
 * <Squircle as="button" radius={16} onClick={handleClick}>
 *   Submit
 * </Squircle>
 * ```
 */
export const Squircle = React.forwardRef<HTMLElement, SquircleProps>(
  (
    {
      children,
      radius = { mobile: 30, desktop: 40 },
      borderWidth = 0,
      borderColor = 'currentColor',
      className = '',
      as: Component = 'div',
      style: userStyle,
      mobileBreakpoint = 769,
      ...props
    },
    forwardedRef
  ) => {
    const { ref, style, pathData, isSupported, isHydrated } = useSquircle({
      radius,
      mobileBreakpoint,
    });

    // Merge refs
    const mergedRef = useMemo(() => {
      return (node: HTMLElement | null) => {
        // Set internal ref
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        // Set forwarded ref
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      };
    }, [ref, forwardedRef]);

    // Combine user styles with squircle styles
    const combinedStyle: React.CSSProperties = {
      ...style,
      ...userStyle,
    };

    // For fallback mode, apply CSS border
    const shouldUseClipPath = isSupported && pathData;
    if (!shouldUseClipPath && borderWidth > 0) {
      combinedStyle.border = `${borderWidth}px solid ${borderColor}`;
    }

    return (
      <Component
        ref={mergedRef}
        className={className}
        style={combinedStyle}
        suppressHydrationWarning={!isHydrated}
        {...props}
      >
        {children}

        {/* SVG Border Overlay - only for clip-path mode */}
        {shouldUseClipPath && borderWidth > 0 && (
          <svg
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: -borderWidth / 2,
              left: -borderWidth / 2,
              width: `calc(100% + ${borderWidth}px)`,
              height: `calc(100% + ${borderWidth}px)`,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <path
              d={pathData}
              fill="none"
              stroke={borderColor}
              // Double width because clip-path cuts off the outer half
              strokeWidth={borderWidth * 2}
              vectorEffect="non-scaling-stroke"
              style={{ transform: `translate(${borderWidth / 2}px, ${borderWidth / 2}px)` }}
            />
          </svg>
        )}
      </Component>
    );
  }
);

Squircle.displayName = 'Squircle';
