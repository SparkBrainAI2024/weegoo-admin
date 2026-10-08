export interface PlaceSuggestion {
    id: string;
    name: string;
    address?: string;
}

export interface Place extends PlaceSuggestion {
    latitude: number;
    longitude: number;
    source: string;
}

// Vite. If you're on CRA: process.env.REACT_APP_BAATO_API_KEY
const KEY = import.meta.env.VITE_BAATO_KEY as string;
const BASE = 'https://api.baato.io/api/v1';

// search results have names and addresses only, no coordinates
export async function searchBaato(q: string, signal: AbortSignal): Promise<PlaceSuggestion[]> {
    const res = await fetch(`${BASE}/search?${new URLSearchParams({ key: KEY, q, limit: '10' })}`, { signal });
    if (!res.ok) throw new Error(`Baato search failed (${res.status})`);
    const json = await res.json();
    return (json.data ?? []).map((p: any) => ({ id: String(p.placeId), name: p.name, address: p.address }));
}

// coordinates come from the places endpoint, once the user picks a result
export async function getPlaceDetails(placeId: string): Promise<Place> {
    const res = await fetch(`${BASE}/places?${new URLSearchParams({ key: KEY, placeId })}`);
    if (!res.ok) throw new Error(`Baato place details failed (${res.status})`);
    const json = await res.json();
    const p = json.data?.[0];
    if (!p?.centroid) throw new Error('Place has no coordinates');
    return {
        id: String(p.placeId),
        name: p.name,
        address: p.address,
        latitude: p.centroid.lat,
        longitude: p.centroid.lon,
        source: 'Baato API'
    };
}
