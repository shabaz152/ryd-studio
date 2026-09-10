import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { put } from '@vercel/blob';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const token = env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

  return {
    plugins: [
      react(),
      {
        name: 'vite-api-sync-middleware',
        configureServer(server) {
          server.middlewares.use('/api/sync', async (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (req.method === 'OPTIONS') {
              res.statusCode = 200;
              res.end();
              return;
            }

            const STATE_BLOB_NAME = 'ryd_studio_state.json';

            if (req.method === 'GET') {
              try {
                const response = await fetch(
                  `https://4gbu7gvanz0l7r8s.public.blob.vercel-storage.com/${STATE_BLOB_NAME}?t=${Date.now()}`,
                  { cache: 'no-store' }
                );
                if (response.ok) {
                  const data = await response.json();
                  res.statusCode = 200;
                  res.end(JSON.stringify({ exists: true, data, timestamp: data._syncTimestamp }));
                } else {
                  res.statusCode = 200;
                  res.end(JSON.stringify({ exists: false, data: null }));
                }
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
              return;
            }

            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const payload = JSON.parse(body);
                  const timestamp = Date.now();
                  const stateWithMeta = { ...payload, _syncTimestamp: timestamp };
                  const blob = await put(STATE_BLOB_NAME, JSON.stringify(stateWithMeta), {
                    access: 'public',
                    addRandomSuffix: false,
                    contentType: 'application/json',
                    token,
                  });
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, timestamp, url: blob.url }));
                } catch (err: any) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }

            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
          });
        },
      },
    ],
    server: {
      port: 3000,
      host: true,
    },
  };
});

