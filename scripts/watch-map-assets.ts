import { execFile } from 'node:child_process';
import { isAbsolute, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import type { Plugin } from 'vite';

const execFileAsync = promisify(execFile);

/** Rebuild generated map data before restarting the development server. */
export function watchMapAssets(): Plugin {
  let cleanup: (() => void) | undefined;
  return {
    name: 'watch-map-assets',
    apply: 'serve',
    closeBundle() {
      cleanup?.();
    },
    configureServer(server) {
      const assetsDirectory = resolve(server.config.root, 'assets');
      let timer: ReturnType<typeof setTimeout> | undefined;
      let pending = false;
      let rebuilding = false;
      let closed = false;

      async function rebuild() {
        if (rebuilding || closed) return;
        rebuilding = true;
        try {
          // An editor may emit several events while saving or replacing a file.
          do {
            pending = false;
            server.config.logger.info('SVG assets changed; rebuilding map data…');
            const { stdout, stderr } = await execFileAsync(
              process.platform === 'win32' ? 'npm.cmd' : 'npm',
              ['run', 'predev'],
              { cwd: server.config.root },
            );
            if (stdout.trim()) server.config.logger.info(stdout.trim());
            if (stderr.trim()) server.config.logger.warn(stderr.trim());
          } while (pending && !closed);
          if (!closed) {
            await server.restart();
            server.hot.send({ type: 'full-reload' });
          }
        } catch (error) {
          server.config.logger.error(`Failed to rebuild SVG assets: ${String(error)}`);
        } finally {
          rebuilding = false;
        }
      }

      function onAssetEvent(event: string, file: string) {
        if (!['add', 'change', 'unlink'].includes(event)) return;
        const assetPath = relative(assetsDirectory, file);
        if (isAbsolute(assetPath) || assetPath.startsWith('..') || !assetPath.endsWith('.svg')) return;
        pending = true;
        clearTimeout(timer);
        timer = setTimeout(() => void rebuild(), 250);
      }

      server.watcher.add(assetsDirectory);
      server.watcher.on('all', onAssetEvent);
      cleanup = () => {
        closed = true;
        clearTimeout(timer);
        server.watcher.off('all', onAssetEvent);
      };
    },
  };
}
