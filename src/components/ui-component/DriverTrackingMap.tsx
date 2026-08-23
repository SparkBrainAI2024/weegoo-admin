// DriverTrackingMap.tsx
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Paper, Typography } from '@mui/material';
import { useDriverLocation } from 'hooks/useDriverLocation';

const BAATO_KEY = import.meta.env.VITE_BAATO_KEY as string | undefined;
const BAATO_STYLE_URL = BAATO_KEY ? `https://api.baato.io/api/v1/styles/breeze?key=${encodeURIComponent(BAATO_KEY)}` : undefined;

interface DriverTrackingMapProps {
    rideId: string;
    ablyKey?: string;
    height?: number;
}

export default function DriverTrackingMap({ rideId, ablyKey, height = 220 }: DriverTrackingMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const rafRef = useRef<number | null>(null);
    const hasDriverPositionRef = useRef(false);
    const [mapError, setMapError] = useState<string | null>(null);
    const location = useDriverLocation(rideId, ablyKey);

    // init map once
    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current || !BAATO_STYLE_URL) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: BAATO_STYLE_URL,
            center: [85.324, 27.7172], // Kathmandu default
            zoom: 13
        });

        map.on('load', () => {
            map.resize();
        });

        map.on('error', (e) => {
            console.error('Baato map error:', e.error);
            setMapError('Unable to load the map. Check the Baato key and its allowed domains.');
        });

        mapRef.current = map;

        const el = document.createElement('div');
        el.style.width = '28px';
        el.style.height = '28px';
        el.style.borderRadius = '50%';
        el.style.background = '#1976d2';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 0 4px rgba(0,0,0,0.4)';

        markerRef.current = new maplibregl.Marker({ element: el, rotationAlignment: 'map' });

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
            hasDriverPositionRef.current = false;
        };
    }, []);

    // move marker on new location, with a smooth animated transition
    useEffect(() => {
        if (!location || !mapRef.current || !markerRef.current) return;

        const { lat, lng, heading } = location;
        const marker = markerRef.current;
        if (typeof heading === 'number') {
            marker.setRotation(heading);
        }

        if (!hasDriverPositionRef.current) {
            marker.setLngLat([lng, lat]).addTo(mapRef.current);
            hasDriverPositionRef.current = true;
            mapRef.current.flyTo({ center: [lng, lat], zoom: Math.max(mapRef.current.getZoom(), 15), essential: true });
            return;
        }

        const from = marker.getLngLat();

        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }

        const start = performance.now();
        const duration = 1000; // match your update interval
        const fromLng = from.lng;
        const fromLat = from.lat;

        function animate(now: number) {
            const t = Math.min((now - start) / duration, 1);
            marker.setLngLat([fromLng + (lng - fromLng) * t, fromLat + (lat - fromLat) * t]);
            if (t < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                rafRef.current = null;
            }
        }
        rafRef.current = requestAnimationFrame(animate);

        mapRef.current.panTo([lng, lat], { duration: 500 });

        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [location]);

    return (
        <Paper elevation={2} sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
            <Box ref={mapContainerRef} sx={{ width: '100%', height, bgcolor: 'grey.100' }} />
            {!BAATO_STYLE_URL && (
                <MapMessage message="Map is unavailable: add VITE_BAATO_KEY to the environment." />
            )}
            {mapError && <MapMessage message={mapError} />}
            {!location && BAATO_STYLE_URL && !mapError && (
                <MapMessage message={ablyKey ? 'Waiting for driver location…' : 'Map ready. Add VITE_ABLY_KEY for live driver tracking.'} />
            )}
            {location && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: 'background.paper',
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 1,
                        boxShadow: 1
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Last update: {new Date(location.ts).toLocaleTimeString()}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}

const MapMessage = ({ message }: { message: string }) => (
    <Box
        sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            pointerEvents: 'none'
        }}
    >
        <Typography variant="caption" color="text.secondary" sx={{ bgcolor: 'background.paper', borderRadius: 1, px: 1, py: 0.5 }}>
            {message}
        </Typography>
    </Box>
);
