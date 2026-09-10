/**
 * RYD STUDIO - Real-Time Cross-Device Cloud Sync Engine
 * Powered by Vercel Edge CDN & Vercel Blob Store
 * Enables real-time synchronization of sessions, allotments, student rosters,
 * teacher progress, and CRM leads across all devices (phones, tablets, laptops).
 */

export const PUBLIC_BLOB_URL = 'https://4gbu7gvanz0l7r8s.public.blob.vercel-storage.com/ryd_studio_state.json';
export const SYNC_API_ENDPOINT = '/api/sync';

export interface CloudSyncPayload {
  teacher: any;
  batches: any[];
  sessions: any[];
  leads: any[];
  updates: any[];
  workbookOrders: any[];
  freeSlots: any[];
  reviews: any[];
  referralStats: any;
  _syncTimestamp?: number;
}

// Multi-tab local channel for zero-latency (<10ms) sync across tabs on same device
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel('ryd_studio_cloud_sync_bus');
  }
} catch {
  // Ignore in environments without BroadcastChannel
}

export const notifyOtherTabs = (timestamp: number) => {
  try {
    broadcastChannel?.postMessage({ type: 'RYD_STUDIO_SYNC', timestamp });
  } catch {
    // ignore
  }
};

export const onOtherTabSync = (callback: (timestamp: number) => void) => {
  if (!broadcastChannel) return () => {};
  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'RYD_STUDIO_SYNC' && typeof event.data?.timestamp === 'number') {
      callback(event.data.timestamp);
    }
  };
  broadcastChannel.addEventListener('message', handler);
  return () => broadcastChannel?.removeEventListener('message', handler);
};

/**
 * Fetch the latest global studio state from cloud storage
 */
export async function fetchRemoteStudioState(): Promise<{
  success: boolean;
  data: CloudSyncPayload | null;
  timestamp: number;
}> {
  // Attempt 1: Try /api/sync serverless endpoint
  try {
    const res = await fetch(`${SYNC_API_ENDPOINT}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.exists && json.data) {
        return {
          success: true,
          data: json.data,
          timestamp: json.timestamp || json.data._syncTimestamp || 0,
        };
      }
    }
  } catch {
    // API endpoint might be unreachable or in pure client mode, fall through to direct CDN
  }

  // Attempt 2: Direct read from Vercel Edge CDN Public Blob (global sub-50ms latency)
  try {
    const res = await fetch(`${PUBLIC_BLOB_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      if (data) {
        return {
          success: true,
          data,
          timestamp: data._syncTimestamp || 0,
        };
      }
    }
  } catch (cdnErr) {
    console.warn('[RYD Sync] Could not fetch from CDN blob:', cdnErr);
  }

  return { success: false, data: null, timestamp: 0 };
}

/**
 * Push updated studio state to cloud storage
 */
let pushDebounceTimer: any = null;

export function pushRemoteStudioState(
  payload: CloudSyncPayload,
  onComplete?: (success: boolean, timestamp: number) => void
): void {
  if (pushDebounceTimer) {
    clearTimeout(pushDebounceTimer);
  }

  pushDebounceTimer = setTimeout(async () => {
    const timestamp = Date.now();
    const payloadWithMeta = {
      ...payload,
      _syncTimestamp: timestamp,
    };

    try {
      const res = await fetch(SYNC_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadWithMeta),
      });

      if (res.ok) {
        const json = await res.json();
        notifyOtherTabs(timestamp);
        onComplete?.(true, json.timestamp || timestamp);
        return;
      }
    } catch (err) {
      console.warn('[RYD Sync] POST /api/sync failed:', err);
    }

    onComplete?.(false, timestamp);
  }, 400); // 400ms debounce
}
