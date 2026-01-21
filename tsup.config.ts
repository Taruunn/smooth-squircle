import { defineConfig } from 'tsup';

export default defineConfig([
    // Main bundle (React + core)
    {
        entry: ['src/index.ts'],
        format: ['cjs', 'esm'],
        dts: true,
        splitting: true,
        clean: true,
        treeshake: true,
        external: ['react', 'react-dom'],
        minify: true,
        sourcemap: true,
    },
    // Core-only bundle (framework-agnostic)
    {
        entry: { core: 'src/core/index.ts' },
        format: ['cjs', 'esm'],
        dts: true,
        treeshake: true,
        minify: true,
        sourcemap: true,
    },
    // Web Component bundle
    {
        entry: { 'web-component': 'src/web-component/index.ts' },
        format: ['cjs', 'esm'],
        dts: true,
        treeshake: true,
        minify: true,
        sourcemap: true,
    },
]);
