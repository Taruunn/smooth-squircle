import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Squircle } from '../react/Squircle';
import { useSquircle } from '../react/useSquircle';

// Mock the useSquircle hook to control its return values
vi.mock('../react/useSquircle', async () => {
    const actual = await vi.importActual('../react/useSquircle');
    return {
        ...actual,
    };
});

describe('Squircle Component', () => {
    it('should render children correctly', () => {
        render(
            <Squircle radius={20}>
                <span data-testid="child">Hello</span>
            </Squircle>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('should apply className', () => {
        const { container } = render(
            <Squircle radius={20} className="my-custom-class">
                Content
            </Squircle>
        );

        expect(container.firstChild).toHaveClass('my-custom-class');
    });

    it('should render as different element types', () => {
        const { container, rerender } = render(
            <Squircle as="button" radius={20}>
                Click me
            </Squircle>
        );

        expect(container.querySelector('button')).toBeInTheDocument();

        rerender(
            <Squircle as="a" radius={20} href="/test">
                Link
            </Squircle>
        );

        expect(container.querySelector('a')).toBeInTheDocument();
        expect(container.querySelector('a')).toHaveAttribute('href', '/test');
    });

    it('should merge user styles with squircle styles', () => {
        const { container } = render(
            <Squircle radius={20} style={{ backgroundColor: 'red' }}>
                Content
            </Squircle>
        );

        const element = container.firstChild as HTMLElement;
        expect(element.style.backgroundColor).toBe('red');
    });

    it('should forward ref correctly', () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <Squircle radius={20} ref={ref}>
                Content
            </Squircle>
        );

        expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('should pass through HTML attributes', () => {
        render(
            <Squircle radius={20} data-testid="squircle" aria-label="Squircle container">
                Content
            </Squircle>
        );

        const element = screen.getByTestId('squircle');
        expect(element).toHaveAttribute('aria-label', 'Squircle container');
    });

    it('should apply default radius when not provided', () => {
        const { container } = render(<Squircle>Content</Squircle>);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle numeric radius', () => {
        const { container } = render(<Squircle radius={30}>Content</Squircle>);
        expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle responsive radius object', () => {
        const { container } = render(
            <Squircle radius={{ mobile: 16, desktop: 24 }}>Content</Squircle>
        );
        expect(container.firstChild).toBeInTheDocument();
    });

    it('should render button with type attribute', () => {
        const { container } = render(
            <Squircle as="button" type="submit" radius={20}>
                Submit
            </Squircle>
        );

        expect(container.querySelector('button')).toHaveAttribute('type', 'submit');
    });
});

describe('useSquircle Hook', () => {
    it('should return required properties', () => {
        let hookResult: ReturnType<typeof useSquircle>;

        function TestComponent() {
            hookResult = useSquircle({ radius: 20 });
            return <div ref={hookResult.ref as React.RefObject<HTMLDivElement>}>Test</div>;
        }

        render(<TestComponent />);

        expect(hookResult!.ref).toBeDefined();
        expect(hookResult!.style).toBeDefined();
        expect(typeof hookResult!.isSupported).toBe('boolean');
        expect(typeof hookResult!.isHydrated).toBe('boolean');
        expect(typeof hookResult!.currentRadius).toBe('number');
    });

    it('should handle responsive radius', () => {
        let hookResult: ReturnType<typeof useSquircle>;

        function TestComponent() {
            hookResult = useSquircle({
                radius: { mobile: 16, desktop: 24 },
            });
            return <div ref={hookResult.ref as React.RefObject<HTMLDivElement>}>Test</div>;
        }

        render(<TestComponent />);

        expect(hookResult!.currentRadius).toBeDefined();
    });
});
