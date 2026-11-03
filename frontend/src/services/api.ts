import { ScanResponse, StatsResponse, ProviderStatus, MediaType } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

let currentAuthToken: string | null = null;

export function setAuthToken(token: string | null) {
  currentAuthToken = token;
}

function getAuthHeaders(existingHeaders: Record<string, string> = {}): Record<string, string> {
  const headers = { ...existingHeaders };
  if (currentAuthToken) {
    headers['Authorization'] = `Bearer ${currentAuthToken}`;
  }
  return headers;
}

export async function fetchHealth(): Promise<{ status: string; service: string; version: string }> {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function uploadAndScan(file: File, mediaType: MediaType): Promise<ScanResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('media_type', mediaType);

  const res = await fetch(`${API_BASE_URL}/api/scans`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Upload and forensic scan failed.');
  }

  return res.json();
}

export async function analyzeText(text: string, title?: string): Promise<ScanResponse> {
  const res = await fetch(`${API_BASE_URL}/api/text/analyze`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text, title: title || 'Pasted Text Passage' }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Text analysis failed.');
  }

  return res.json();
}

export async function uploadTextDoc(file: File): Promise<ScanResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/api/text/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Document text upload failed.');
  }

  return res.json();
}

export async function fetchScans(filters?: {
  media_type?: string;
  verdict?: string;
  limit?: number;
}): Promise<ScanResponse[]> {
  const params = new URLSearchParams();
  if (filters?.media_type && filters.media_type !== 'all') {
    params.append('media_type', filters.media_type);
  }
  if (filters?.verdict && filters.verdict !== 'all') {
    params.append('verdict', filters.verdict);
  }
  if (filters?.limit) {
    params.append('limit', filters.limit.toString());
  }

  const res = await fetch(`${API_BASE_URL}/api/scans?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch scans history.');
  return res.json();
}

export async function fetchScanById(id: string): Promise<ScanResponse> {
  const res = await fetch(`${API_BASE_URL}/api/scans/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Scan not found (ID: ${id})`);
  return res.json();
}

export async function deleteScan(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/scans/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete scan record.');
  return res.json();
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch dashboard statistics.');
  return res.json();
}

export async function fetchProviders(): Promise<ProviderStatus[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/providers`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback: If localhost failed (e.g. Windows IPv6 resolving to ::1 instead of 127.0.0.1)
    if (API_BASE_URL.includes('localhost')) {
      try {
        const altUrl = API_BASE_URL.replace('localhost', '127.0.0.1');
        const altRes = await fetch(`${altUrl}/api/providers`);
        if (altRes.ok) return await altRes.json();
      } catch {}
    }
    // Also try relative path through Vite proxy
    try {
      const relRes = await fetch('/api/providers');
      if (relRes.ok) return await relRes.json();
    } catch {}
    console.error('[TruthLens API] Error fetching providers:', err);
    throw err;
  }
  throw new Error('Failed to fetch provider status.');
}
