// DriverTrackingMap.tsx
import { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Box, Paper, Typography } from '@mui/material';
import { useDriverLocation } from 'hooks/useDriverLocation';

const BAATO_KEY = import.meta.env.VITE_BAATO_KEY as string;
const BAATO_STYLE_URL = `https://api.baato.io/api/v1/styles/breeze?key=${BAATO_KEY}`;
interface DriverTrackingMapProps {
    rideId: string;
    ablyKey: string;
}

export default function DriverTrackingMap({ rideId, ablyKey }: DriverTrackingMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const rafRef = useRef<number | null>(null);
    const location = useDriverLocation(rideId, ablyKey);

    // init map once
    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: BAATO_STYLE_URL,
            center: [85.324, 27.7172], // Kathmandu default
            zoom: 13
        });

        map.on('error', (e) => {
            console.error('Map load error:', e.error);
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
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // move marker on new location, with a smooth animated transition
    useEffect(() => {
        if (!location || !mapRef.current || !markerRef.current) return;

        const { lat, lng, heading } = location;
        const marker = markerRef.current;
        const from = marker.getLngLat();

        if (typeof heading === 'number') {
            marker.setRotation(heading);
        }

        if (!from) {
            marker.setLngLat([lng, lat]).addTo(mapRef.current);
            mapRef.current.setCenter([lng, lat]);
            return;
        }

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
            <Box ref={mapContainerRef} sx={{ width: '100%', height: 480 }} />
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
