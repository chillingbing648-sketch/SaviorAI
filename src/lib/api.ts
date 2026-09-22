const configuredBase = ((import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const API_BASE_URL = configuredBase;

export function apiUrl(path: string): string {
  return `${configuredBase}${path.startsWith('/') ? path : `/${path}`}`;
}

export function isStaticPagesHost(): boolean {
  return typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}
