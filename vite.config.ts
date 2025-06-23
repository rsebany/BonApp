import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path, { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
            '@/components': path.resolve(__dirname, 'resources/js/components'),
            '@/types': path.resolve(__dirname, 'resources/js/types'),
            '@/layouts': path.resolve(__dirname, 'resources/js/layouts'),
            '@/pages': path.resolve(__dirname, 'resources/js/pages'),
        },
    },
    define: {
        'process.env.MIX_GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.MIX_GOOGLE_MAPS_API_KEY || ''),
    },
});
