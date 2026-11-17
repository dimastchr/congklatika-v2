import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const staticRuntimeFiles = [
  'app.js',
  'buji-avatar-optimized.webp',
  'team-alfi-optimized.webp',
  'team-dimas-optimized.webp',
  'team-faisal-optimized.webp',
  'team-putri-optimized.webp',
];

function copyRuntimeAssetsPlugin() {
  return {
    name: 'copy-congklatika-runtime-assets',
    closeBundle() {
      const distDir = path.resolve(rootDir, 'dist');
      if (!fs.existsSync(distDir)) return;
      for (const file of staticRuntimeFiles) {
        const src = path.resolve(rootDir, file);
        const dest = path.resolve(distDir, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      }
    },
  };
}

function injectFirebaseClientPlugin() {
  return {
    name: 'inject-congklatika-firebase-client',
    transformIndexHtml: {
      order: 'pre',
      handler() {
        return [
          {
            tag: 'script',
            attrs: { type: 'module', src: '/src/firebase-client.js' },
            injectTo: 'body',
          },
        ];
      },
    },
  };
}

export default {
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
  plugins: [injectFirebaseClientPlugin(), copyRuntimeAssetsPlugin()],
};
