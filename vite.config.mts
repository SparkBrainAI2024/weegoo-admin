import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    // depending on your application, base can also be "/"
    base: process.env.VITE_APP_BASE_NAME,
    plugins: [react(), viteTsconfigPaths()],
    define: {
        global: 'window'
    },
    build: { chunkSizeWarningLimit: 1600 },
    resolve: {
        alias: [
            // { find: '', replacement: path.resolve(__dirname, 'src') },
            // {
            //   find: /^~(.+)/,
            //   replacement: path.join(process.cwd(), 'node_modules/$1')
            // },
            // {
            //   find: /^src(.+)/,
            //   replacement: path.join(process.cwd(), 'src/$1')
            // }
            // {
            //     find: 'assets',
            //     replacement: path.join(process.cwd(), 'src/assets')
            // }
        ]
    },
    server: {
        host: '0.0.0.0',
        port: Number(process.env.PORT) || 8000,
        open: false,
        watch: {
          usePolling: true,
        },

    },

    preview: {
        host: '0.0.0.0',
        port: Number(process.env.PORT) || 8000
    }
});
