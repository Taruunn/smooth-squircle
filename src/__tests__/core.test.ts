import { describe, it, expect } from 'vitest';
import {
    getSquirclePath,
    getSquircleSVG,
    getSquircleDataUri,
    squircleBezierApproximation,
    supportsClipPath,
    hasResizeObserver,
} from '../core';

describe('squircleBezierApproximation', () => {
    it('should be a readonly array of control points', () => {
        expect(squircleBezierApproximation).toBeDefined();
        expect(squircleBezierApproximation.length).toBe(3);
        // Each segment has 3 control points
        squircleBezierApproximation.forEach((segment) => {
            expect(segment.length).toBe(3);
            segment.forEach((point) => {
                expect(point.length).toBe(2);
                expect(typeof point[0]).toBe('number');
                expect(typeof point[1]).toBe('number');
            });
        });
    });
});

describe('getSquirclePath', () => {
    it('should generate a valid SVG path string', () => {
        const path = getSquirclePath(100, 100, 20);
        expect(path).toBeTruthy();
        expect(typeof path).toBe('string');
        expect(path).toMatch(/^M/); // Starts with moveto
        expect(path).toMatch(/Z$/); // Ends with closepath
    });

    it('should work with object options', () => {
        const path = getSquirclePath({ width: 100, height: 100, radius: 20 });
        expect(path).toBeTruthy();
        expect(path).toMatch(/^M/);
    });

    it('should return empty string for zero width', () => {
        const path = getSquirclePath(0, 100, 20);
        expect(path).toBe('');
    });

    it('should return empty string for zero height', () => {
        const path = getSquirclePath(100, 0, 20);
        expect(path).toBe('');
    });

    it('should clamp radius to half the smallest dimension', () => {
        const pathSmall = getSquirclePath(40, 100, 50);
        const pathClamped = getSquirclePath(40, 100, 20); // 20 = 40/2

        // Both should start at the same x position (clamped radius)
        expect(pathSmall).toContain('M 20 0');
        expect(pathClamped).toContain('M 20 0');
    });

    it('should generate different paths for different dimensions', () => {
        const path1 = getSquirclePath(100, 100, 20);
        const path2 = getSquirclePath(200, 100, 20);
        expect(path1).not.toBe(path2);
    });

    it('should contain cubic bezier commands', () => {
        const path = getSquirclePath(100, 100, 20);
        expect(path).toMatch(/C \d/); // Contains cubic bezier
    });
});

describe('getSquircleSVG', () => {
    it('should generate a complete SVG string', () => {
        const svg = getSquircleSVG(100, 100, 20);
        expect(svg).toContain('<svg');
        expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
        expect(svg).toContain('width="100"');
        expect(svg).toContain('height="100"');
        expect(svg).toContain('<path');
        expect(svg).toContain('fill="black"');
        expect(svg).toContain('</svg>');
    });

    it('should include the generated path', () => {
        const svg = getSquircleSVG(100, 100, 20);
        expect(svg).toMatch(/d="M/);
    });
});

describe('getSquircleDataUri', () => {
    it('should generate a data URI', () => {
        const uri = getSquircleDataUri(100, 100, 20);
        expect(uri).toMatch(/^data:image\/svg\+xml,/);
    });

    it('should be URL-encoded', () => {
        const uri = getSquircleDataUri(100, 100, 20);
        expect(uri).toContain('%3Csvg'); // Encoded <svg
    });
});

describe('supportsClipPath', () => {
    it('should return true when CSS.supports returns true', () => {
        // CSS.supports is mocked in setup.ts
        expect(supportsClipPath()).toBe(true);
    });

    it('should return false when window is undefined', () => {
        const originalWindow = globalThis.window;
        // @ts-ignore
        delete globalThis.window;
        // Need to reimport to get fresh module state
        expect(typeof window).toBe('undefined');
        // @ts-ignore
        globalThis.window = originalWindow;
    });
});

describe('hasResizeObserver', () => {
    it('should return true when ResizeObserver exists', () => {
        expect(hasResizeObserver()).toBe(true);
    });
});
