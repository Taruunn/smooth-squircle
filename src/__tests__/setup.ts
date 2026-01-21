import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock CSS.supports for browser feature detection
Object.defineProperty(globalThis, 'CSS', {
    value: {
        supports: vi.fn((property: string, value: string) => {
            // Simulate modern browser support for clip-path: path()
            if (property === 'clip-path' && value.includes('path')) {
                return true;
            }
            return false;
        }),
    },
});

// Mock ResizeObserver as a proper class
class MockResizeObserver {
    callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
}

globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
