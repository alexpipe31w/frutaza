// lib/stockup/client.ts
// Cliente HTTP para la API de StockUp.
// IMPORTANTE: Este archivo solo debe usarse en server-side (Route Handlers, Server Components).
// Nunca importar directamente en componentes 'use client'.

import { stockupConfig } from './config';

const BASE_URL = `${stockupConfig.apiUrl}/api/public/v1`;

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  revalidate?: number;
  searchParams?: Record<string, string | number | boolean | undefined>;
};

async function stockupFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { method = 'GET', body, revalidate = 60, searchParams } = options;

  // Construir URL con query params
  let url = `${BASE_URL}${endpoint}`;
  if (searchParams) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': stockupConfig.apiKey,
    },
    // Cache de Next.js — equivalente al next: { revalidate } de shopifyFetch
    next: { revalidate },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || `StockUp API error: ${response.status} ${response.statusText}`
    );
  }

  const json = await response.json();

  // La API de StockUp siempre devuelve { success: true, data: ... }
  if (!json.success) {
    throw new Error(json.error || 'StockUp API returned success: false');
  }

  return json.data as T;
}

export default stockupFetch;