// DriverTrackingMap.tsx
import { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useDriverLocation } from 'hooks/useDriverLocation';
import * as Ably from 'ably';

declare global {
    interface Window {
        maplibregl: any;
    }
}

const BAATO_KEY = import.meta.env.VITE_BAATO_KEY as string | undefined;

// Use a different Baato style URL or add fallback
const BAATO_STYLE_URL = BAATO_KEY ? `https://api.baato.io/api/v1/styles/breeze?key=${encodeURIComponent(BAATO_KEY)}` : undefined;

// Alternative style URLs if breeze doesn't work
const BAATO_STYLE_FALLBACK = BAATO_KEY ? `https://api.baato.io/api/v1/styles/light?key=${encodeURIComponent(BAATO_KEY)}` : undefined;

// Load Maplibre from CDN
const loadMaplibre = () => {
    return new Promise((resolve, reject) => {
        if (window.maplibregl) {
            resolve(window.maplibregl);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js';
        script.async = true;
        script.onload = () => resolve(window.maplibregl);
        script.onerror = reject;
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css';
        document.head.appendChild(link);
    });
};

interface DriverTrackingMapProps {
    rideId: string;
    ablyKey?: string;
    height?: number;
    driverId?: string;
}

export default function DriverTrackingMap({ rideId, ablyKey, height = 220, driverId: propDriverId }: DriverTrackingMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any | null>(null);
    const markerRef = useRef<any | null>(null);
    const rafRef = useRef<number | null>(null);
    const hasDriverPositionRef = useRef(false);
    const tileErrorCount = useRef(0);

    const [mapError, setMapError] = useState<string | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [maplibreLoaded, setMaplibreLoaded] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<any>(null);
    const [usingFallback, setUsingFallback] = useState(false);

    // Use the hook
    const location = useDriverLocation(rideId, ablyKey);

    // Direct Ably subscription
    useEffect(() => {
        if (!ablyKey) return;

        const driverId = propDriverId || rideId;
        const channelName = `WG-DRIVER-${driverId}-driver-location`;

        console.log('📡 Subscribing to channel:', channelName);

        const realtime = new Ably.Realtime(ablyKey);
        const channel = realtime.channels.get(channelName);

        channel.subscribe('driver-location', (message) => {
            console.log('📍 Driver location received:', message.data);
            const data = message.data;

            if (data && typeof data.lat === 'number' && typeof data.lng === 'number') {
                setCurrentLocation({
                    lat: data.lat,
                    lng: data.lng,
                    ts: Date.now(),
                    heading: data.heading || 0,
                    moving: data.moving || false
                });
            }
        });

        return () => {
            channel.unsubscribe();
            realtime.close();
        };
    }, [ablyKey, rideId, propDriverId]);

    // Load Maplibre
    useEffect(() => {
        loadMaplibre()
            .then(() => {
                setMaplibreLoaded(true);
                console.log('Maplibre loaded successfully');
            })
            .catch((error) => {
                console.error('Failed to load Maplibre:', error);
                setMapError('Failed to load map library');
            });
    }, []);

    // Init map with retry logic
    useEffect(() => {
        if (!maplibreLoaded || !mapContainerRef.current || !BAATO_STYLE_URL || mapRef.current) {
            return;
        }

        const initMap = (styleUrl: string) => {
            try {
                const maplibregl = window.maplibregl;

                const map = new maplibregl.Map({
                    container: mapContainerRef.current!,
                    style: styleUrl,
                    center: [85.324, 27.7172],
                    zoom: 13,
                    attributionControl: false,
                    // Add custom tile source as fallback
                    transformRequest: (url: string, resourceType: string) => {
                        // Log tile requests for debugging
                        if (resourceType === 'Tile' && url.includes('baato')) {
                            console.log('Tile request:', url);
                        }
                        return { url };
                    }
                });

                // Add controls
                map.addControl(new maplibregl.AttributionControl(), 'bottom-right');
                map.addControl(new maplibregl.NavigationControl(), 'top-right');

                // Handle successful load
                map.on('load', () => {
                    setIsMapReady(true);
                    map.resize();
                    console.log('Map loaded successfully with style:', styleUrl);
                    setMapError(null);
                });

                // Handle style loading errors
                map.on('style.error', (e: any) => {
                    console.error('Style error:', e);
                    if (!usingFallback && BAATO_STYLE_FALLBACK && styleUrl !== BAATO_STYLE_FALLBACK) {
                        console.log('Attempting fallback style...');
                        setUsingFallback(true);
                        map.setStyle(BAATO_STYLE_FALLBACK);
                    } else {
                        setMapError('Failed to load map style. Please check your Baato key.');
                    }
                });

                // Handle general errors
                map.on('error', (e: any) => {
                    console.error('Map error:', e);

                    // Check if it's a tile access error
                    if (e.error && e.error.message && e.error.message.includes('AccessDenied')) {
                        tileErrorCount.current += 1;
                        console.warn(`Tile access denied (${tileErrorCount.current} errors)`);

                        // If too many tile errors, try reloading the style
                        if (tileErrorCount.current > 5 && !usingFallback && BAATO_STYLE_FALLBACK) {
                            console.log('Too many tile errors, switching to fallback style...');
                            setUsingFallback(true);
                            map.setStyle(BAATO_STYLE_FALLBACK);
                            tileErrorCount.current = 0;
                        }
                    } else {
                        setMapError('Unable to load the map. Check the Baato key.');
                    }
                });

                mapRef.current = map;

                // Create marker with custom styling
                const el = document.createElement('div');
                el.style.width = '32px';
                el.style.height = '32px';
                el.style.borderRadius = '50%';
                el.style.background = '#1976d2';
                el.style.border = '3px solid white';
                el.style.boxShadow = '0 0 8px rgba(0,0,0,0.4)';
                el.style.cursor = 'pointer';
                el.style.position = 'relative';

                // Add pulsing effect
                const pulse = document.createElement('div');
                pulse.style.position = 'absolute';
                pulse.style.inset = '-8px';
                pulse.style.borderRadius = '50%';
                pulse.style.background = 'rgba(25, 118, 210, 0.3)';
                pulse.style.animation = 'pulse 1.5s ease-out infinite';
                el.appendChild(pulse);

                const style = document.createElement('style');
                style.textContent = `
                    @keyframes pulse {
                        0% { transform: scale(0.5); opacity: 1; }
                        100% { transform: scale(2); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);

                markerRef.current = new maplibregl.Marker({
                    element: el,
                    rotationAlignment: 'map'
                });

                return () => {
                    if (rafRef.current !== null) {
                        cancelAnimationFrame(rafRef.current);
                    }
                    if (mapRef.current) {
                        mapRef.current.remove();
                        mapRef.current = null;
                    }
                    markerRef.current = null;
                    hasDriverPositionRef.current = false;
                    setIsMapReady(false);
                    if (style.parentNode) {
                        style.parentNode.removeChild(style);
                    }
                };
            } catch (error) {
                console.error('Error initializing map:', error);
                setMapError('Failed to initialize map');
                return () => {};
            }
        };

        // Initialize with primary style
        const cleanup = initMap(BAATO_STYLE_URL);
        return cleanup;
    }, [maplibreLoaded, usingFallback]);

    // Update marker when location changes
    useEffect(() => {
        const locationData = location || currentLocation;

        if (!locationData || !mapRef.current || !markerRef.current || !isMapReady) {
            return;
        }

        console.log('🔄 Updating marker with location:', locationData);

        try {
            const { lat, lng, heading } = locationData;
            const marker = markerRef.current;

            if (typeof heading === 'number') {
                marker.setRotation(heading);
            }

            if (!hasDriverPositionRef.current) {
                console.log('📍 Setting initial marker position:', { lat, lng });
                marker.setLngLat([lng, lat]).addTo(mapRef.current);
                hasDriverPositionRef.current = true;

                mapRef.current.flyTo({
                    center: [lng, lat],
                    zoom: Math.max(mapRef.current.getZoom(), 15),
                    essential: true,
                    duration: 1500
                });
                return;
            }

            const from = marker.getLngLat();

            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }

            const start = performance.now();
            const duration = 1000;
            const fromLng = from.lng;
            const fromLat = from.lat;

            function animate(now: number) {
                if (!markerRef.current) return;

                const t = Math.min((now - start) / duration, 1);
                const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                markerRef.current.setLngLat([fromLng + (lng - fromLng) * ease, fromLat + (lat - fromLat) * ease]);

                if (t < 1) {
                    rafRef.current = requestAnimationFrame(animate);
                } else {
                    rafRef.current = null;
                }
            }

            rafRef.current = requestAnimationFrame(animate);
            mapRef.current.panTo([lng, lat], { duration: 800 });
        } catch (error) {
            console.error('Error updating marker position:', error);
        }

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [location, currentLocation, isMapReady]);

    const displayLocation = location || currentLocation;

    return (
        <Paper
            elevation={2}
            sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                height
            }}
        >
            <Box
                ref={mapContainerRef}
                sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: 'grey.100',
                    '& .maplibregl-map': {
                        width: '100%',
                        height: '100%'
                    }
                }}
            />

            {!BAATO_STYLE_URL && <MapMessage message="Map is unavailable: add VITE_BAATO_KEY to the environment." />}
            {mapError && <MapMessage message={mapError} />}
            {usingFallback && !mapError && <MapMessage message="Using fallback map style due to tile access issues." />}
            {(!displayLocation || !isMapReady) && BAATO_STYLE_URL && !mapError && (
                <MapMessage message={ablyKey ? 'Waiting for driver location…' : 'Map ready. Add VITE_ABLY_KEY for live driver tracking.'} />
            )}
            {displayLocation && isMapReady && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: 'background.paper',
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 1,
                        boxShadow: 1,
                        zIndex: 1
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        Last update: {new Date(displayLocation.ts).toLocaleTimeString()}
                    </Typography>
                </Box>
            )}

            {displayLocation && isMapReady && (
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 12,
                        right: 12,
                        bgcolor: 'rgba(255,255,255,0.9)',
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 1,
                        boxShadow: 1,
                        zIndex: 1,
                        fontSize: '11px'
                    }}
                >
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Lat: {displayLocation.lat.toFixed(6)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Lng: {displayLocation.lng.toFixed(6)}
                    </Typography>
                    {displayLocation.moving !== undefined && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Moving: {displayLocation.moving ? '🚗' : '🅿️'}
                        </Typography>
                    )}
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
            pointerEvents: 'none',
            zIndex: 1
        }}
    >
        <Typography
            variant="caption"
            color="text.secondary"
            sx={{
                bgcolor: 'rgba(255,255,255,0.9)',
                borderRadius: 1,
                px: 1.5,
                py: 0.75,
                boxShadow: 1,
                textAlign: 'center',
                maxWidth: '90%'
            }}
        >
            {message}
        </Typography>
    </Box>
);
