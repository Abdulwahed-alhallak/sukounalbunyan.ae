import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { glob } from 'glob';

const noblePackages = glob.sync('packages/noble/*/src/Resources/js/app.tsx');

export default defineConfig({
    base: './',
    plugins: [
        laravel({
            input:
            [
                'resources/js/app.tsx',
                ...noblePackages
            ],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0', // Allow local network requests
        hmr: {
            host: 'localhost',
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': '*',
        },
        watch: {
            ignored: ['**/vendor/**', '**/node_modules/**']
        },
        fs: {
            allow: ['..', 'packages']
        }
    },

    esbuild: {
        jsx: 'automatic',
        jsxImportSource: 'react',
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    build: {
        chunkSizeWarningLimit: 800,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('lucide')) return 'icons';
                        if (id.includes('recharts') || id.includes('d3')) return 'charts';
                        if (id.includes('@radix-ui')) return 'radix';
                        return 'vendor';
                    }
                }
            },
        },
        assetsDir: 'assets',
    }
});
