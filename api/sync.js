import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const STATE_BLOB_NAME = 'ryd_studio_state.json';

  // GET: Retrieve latest global cloud state
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: STATE_BLOB_NAME });
      const stateBlob = blobs.find((b) => b.pathname === STATE_BLOB_NAME);

      if (!stateBlob) {
        return res.status(200).json({ exists: false, data: null, timestamp: 0 });
      }

      // Fetch the actual JSON content from the blob URL
      const response = await fetch(`${stateBlob.url}?t=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json();

      return res.status(200).json({
        exists: true,
        data,
        timestamp: data._syncTimestamp || new Date(stateBlob.uploadedAt).getTime(),
        url: stateBlob.url
      });
    } catch (err) {
      console.error('Error fetching state from blob:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  // POST: Update global cloud state from any device
  if (req.method === 'POST') {
    try {
      const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const timestamp = Date.now();
      const stateWithMeta = {
        ...payload,
        _syncTimestamp: timestamp,
      };

      const blob = await put(STATE_BLOB_NAME, JSON.stringify(stateWithMeta), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      });

      return res.status(200).json({
        success: true,
        timestamp,
        url: blob.url,
      });
    } catch (err) {
      console.error('Error saving state to blob:', err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
