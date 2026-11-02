import { ScanResponse, StatsResponse, ProviderStatus, MediaType } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    headers: { 'Content-Type': 'application/json' },
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

  const res = await fetch(`${API_BASE_URL}/api/scans?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch scans history.');
  return res.json();
}

export async function fetchScanById(id: string): Promise<ScanResponse> {
  const res = await fetch(`${API_BASE_URL}/api/scans/${id}`);
  if (!res.ok) throw new Error(`Scan not found (ID: ${id})`);
  return res.json();
}

export async function deleteScan(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/scans/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete scan record.');
  return res.json();
}

export async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard statistics.');
  return res.json();
}

export async function fetchProviders(): Promise<ProviderStatus[]> {
  const res = await fetch(`${API_BASE_URL}/api/providers`);
  if (!res.ok) throw new Error('Failed to fetch provider status.');
  return res.json();
}

