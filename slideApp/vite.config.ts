import { defineConfig } from 'vite';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import rollupNodePolyFill from 'rollup-plugin-polyfill-node';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        basicSsl(),
        VitePWA({
            injectRegister: 'auto',
            registerType: 'autoUpdate',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
            },
            manifest: {
                name: 'Slyde',
                short_name: 'Slyde',
                description: 'Do you even slyde crypto?',
                theme_color: '#813ef9',
                icons: [
                    {
                        src: 'slyde-logo.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                ],
            },
            devOptions: {
                enabled: false,
                type: 'module',
            },
        }),
    ],
    optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis',
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true,
                }),
                NodeModulesPolyfillPlugin(),
            ],
        },
    },
    server: {
        https: true,
    },
    build: {
        rollupOptions: {
            plugins: [rollupNodePolyFill({ include: null })],
        },
    },
});
