// DriverTrackingMap.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useDriverLocation } from 'hooks/useDriverLocation';

declare global {
    interface Window {
        maplibregl: any;
    }
}

// Temporary visual-testing position for completed/remaining route sections.
// Set to false once live-route progress should be shown again.
const USE_TEST_DRIVER_LOCATION = true;
const TEST_DRIVER_LOCATION = {
    lat: 27.6735,
    lng: 85.4045,
    heading: 0,
    moving: false,
    ts: Date.now()
};

const BAATO_KEY = import.meta.env.VITE_BAATO_KEY as string | undefined;
const BAATO_STYLE_URL = BAATO_KEY ? `https://api.baato.io/api/v1/styles/breeze?key=${encodeURIComponent(BAATO_KEY)}` : undefined;

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

// Baato Directions API - fetch route
// Fetch route from Baato API using direct fetch
// Fetch route from Baato API using direct fetch with better error handling
// Fetch route from Baato API - CORRECT FORMAT
// Fetch route from Baato API - CORRECT FORMAT with 'mode' parameter
// Fetch route from Baato API
const fetchBaatoRoute = async (startLat: number, startLng: number, endLat: number, endLng: number) => {
    if (!BAATO_KEY) {
        console.error('❌ Baato API key is missing');
        return null;
    }

    try {
        const params = new URLSearchParams();
        params.append('points[]', `${startLat},${startLng}`);
        params.append('points[]', `${endLat},${endLng}`);
        params.append('mode', 'car');
        params.append('key', BAATO_KEY);

        const url = `https://api.baato.io/api/v1/directions?${params.toString()}`;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error fetching route:', error);
        return null;
    }
};

interface DriverTrackingMapProps {
    rideId: string;
    ablyKey?: string;
    height?: number;
    driverId?: string;
    pickupLocation?: { lat: number; lng: number; address?: string };
    dropoffLocation?: { lat: number; lng: number; address?: string };
}

export default function DriverTrackingMap({
    rideId,
    ablyKey,
    height = 220,
    driverId: propDriverId,
    pickupLocation,
    dropoffLocation
}: DriverTrackingMapProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<any | null>(null);
    const markerRef = useRef<any | null>(null);
    const rafRef = useRef<number | null>(null);
    const hasDriverPositionRef = useRef(false);
    const routeAddedRef = useRef(false);
    const pickupMarkerRef = useRef<any | null>(null);
    const dropoffMarkerRef = useRef<any | null>(null);

    const [mapError, setMapError] = useState<string | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);
    const [maplibreLoaded, setMaplibreLoaded] = useState(false);
    const [route, setRoute] = useState<any>(null);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);

    // Location channels are keyed by driver ID, not ride ID.
    const location = useDriverLocation(propDriverId || rideId, ablyKey);
    const driverLocation = USE_TEST_DRIVER_LOCATION ? TEST_DRIVER_LOCATION : location;

    // Fetch route from Baato when pickup/dropoff locations are available
    // Fetch route from Baato when pickup/dropoff locations are available
    // Fetch route from Baato when pickup/dropoff locations are available
    // Fetch route from Baato when pickup/dropoff locations are available
    // Fetch route from Baato when pickup/dropoff locations are available
    // Fetch route when locations are available
    useEffect(() => {
        if (!pickupLocation || !dropoffLocation || !BAATO_KEY) return;

        const getRoute = async () => {
            setIsLoadingRoute(true);
            try {
                const routeData = await fetchBaatoRoute(pickupLocation.lat, pickupLocation.lng, dropoffLocation.lat, dropoffLocation.lng);

                console.log('Route data:', routeData);

                if (routeData?.data?.[0]?.encodedPolyline) {
                    setRoute(routeData);
                }
            } catch (error) {
                console.error('Route error:', error);
            } finally {
                setIsLoadingRoute(false);
            }
        };

        getRoute();
    }, [pickupLocation, dropoffLocation]);

    // Simple polyline decoder with null/empty checking
    // Simple polyline decoder
    // Simple polyline decoder - just copy this
    // Decode Google-style encoded polyline with proper typing
    const decodePolyline = (encoded: string): [number, number][] => {
        if (!encoded || typeof encoded !== 'string' || encoded.length === 0) {
            console.warn('⚠️ Empty or invalid polyline string');
            return [];
        }

        try {
            let index = 0;
            let lat = 0;
            let lng = 0;
            const coordinates: [number, number][] = [];
            const factor = 1e5;

            while (index < encoded.length) {
                let result = 0;
                let shift = 0;
                let b;
                do {
                    b = encoded.charCodeAt(index++) - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                const dlat = result & 1 ? ~(result >> 1) : result >> 1;
                lat += dlat;

                result = 0;
                shift = 0;
                do {
                    b = encoded.charCodeAt(index++) - 63;
                    result |= (b & 0x1f) << shift;
                    shift += 5;
                } while (b >= 0x20);
                const dlng = result & 1 ? ~(result >> 1) : result >> 1;
                lng += dlng;

                // Explicitly create a tuple [number, number]
                coordinates.push([lat / factor, lng / factor] as [number, number]);
            }
            return coordinates;
        } catch (error) {
            console.error('❌ Error decoding polyline:', error);
            return [];
        }
    };
    // Import polyline decoder at the top

    // Update the addRouteToMap function
    // Add route to map
    // Add route to map with proper null checks
    // Add route to map - FORCE use API route
    // Add route to map - SIMPLE
    // Add route to map with completed/remaining sections
    // Add route to map with completed/remaining sections
    const addRouteToMap = useCallback(
        (map: any, routeData: any, driverLocation?: { lat: number; lng: number }) => {
            // Get the polyline from API response
            const encodedPolyline = routeData?.data?.[0]?.encodedPolyline;

            if (!encodedPolyline) {
                console.warn('No polyline available');
                return;
            }

            // Decode it
            const decoded = decodePolyline(encodedPolyline);

            // Convert to [lng, lat] for MapLibre
            const coordinates: [number, number][] = decoded.map(([lat, lng]: [number, number]) => [lng, lat] as [number, number]);

            console.log(`🎯 Drawing actual road path with ${coordinates.length} points`);

            // Remove old layers
            ['route-completed', 'route-remaining', 'route-outline', 'route-completed-outline', 'route-remaining-outline'].forEach((id) => {
                if (map.getLayer(id)) map.removeLayer(id);
            });
            if (map.getSource('route-completed')) map.removeSource('route-completed');
            if (map.getSource('route-remaining')) map.removeSource('route-remaining');

            // If we have driver location, split the route
            let completedCoordinates: [number, number][] = [];
            let remainingCoordinates: [number, number][] = coordinates;

            if (driverLocation) {
                const closestIndex = findClosestPointOnRoute(coordinates, driverLocation.lat, driverLocation.lng);

                // Split the route at the closest point
                completedCoordinates = coordinates.slice(0, closestIndex + 1);
                remainingCoordinates = coordinates.slice(closestIndex);

                console.log(`📍 Driver at index ${closestIndex}/${coordinates.length}`);
                console.log(`✅ Completed: ${completedCoordinates.length} points`);
                console.log(`🔄 Remaining: ${remainingCoordinates.length} points`);
            }

            // --- Add completed route (green) ---
            if (completedCoordinates.length > 0) {
                map.addSource('route-completed', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: completedCoordinates
                        },
                        properties: {}
                    }
                });

                // Completed route (green)
                map.addLayer({
                    id: 'route-completed',
                    type: 'line',
                    source: 'route-completed',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: {
                        'line-color': '#22c55e',
                        'line-width': 4,
                        'line-opacity': 0.9
                    }
                });
            }

            // --- Add remaining route (blue) ---
            if (remainingCoordinates.length > 0) {
                map.addSource('route-remaining', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: remainingCoordinates
                        },
                        properties: {}
                    }
                });

                // Remaining route (blue)
                map.addLayer({
                    id: 'route-remaining',
                    type: 'line',
                    source: 'route-remaining',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: {
                        'line-color': '#2563eb',
                        'line-width': 4,
                        'line-opacity': 0.95
                    }
                });
            }

            routeAddedRef.current = true;
            console.log('✅ Route with completed/remaining sections added successfully');

            // Fit map
            if (pickupLocation && dropoffLocation) {
                const bounds = new window.maplibregl.LngLatBounds()
                    .extend([pickupLocation.lng, pickupLocation.lat])
                    .extend([dropoffLocation.lng, dropoffLocation.lat]);
                map.fitBounds(bounds, { padding: 50, duration: 1000 });
            }
        },
        [pickupLocation, dropoffLocation]
    );
    // Helper function to find the closest point on the route
    // Helper function to find the closest point on the route
    const findClosestPointOnRoute = (routeCoordinates: [number, number][], driverLat: number, driverLng: number): number => {
        let closestIndex = 0;
        let closestDistance = Infinity;

        routeCoordinates.forEach((coord, index) => {
            const [lng, lat] = coord;
            const distance = Math.sqrt(Math.pow(lat - driverLat, 2) + Math.pow(lng - driverLng, 2));

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        return closestIndex;
    };
    // Monitor route and map readiness
    // When route is ready and map is ready, add it
    useEffect(() => {
        if (route && isMapReady && mapRef.current && !routeAddedRef.current) {
            addRouteToMap(mapRef.current, route);
        }
    }, [route, isMapReady, addRouteToMap]);
    // Add route to map - defined as useCallback to use in dependencies
    // Add route to map

    // Add pickup/dropoff markers - defined as useCallback
    const addPickupDropoffMarkers = useCallback(
        (map: any) => {
            if (!window.maplibregl) return;
            const maplibregl = window.maplibregl;

            // Pickup marker
            if (pickupLocation) {
                if (pickupMarkerRef.current) {
                    pickupMarkerRef.current.remove();
                }

                const pickupEl = document.createElement('div');
                pickupEl.innerHTML = '📍';
                pickupEl.style.fontSize = '28px';
                pickupEl.style.textShadow = '0 0 4px rgba(0,0,0,0.4)';
                pickupEl.style.cursor = 'pointer';

                const label = document.createElement('div');
                label.textContent = 'Pickup';
                label.style.position = 'absolute';
                label.style.top = '100%';
                label.style.left = '50%';
                label.style.transform = 'translateX(-50%)';
                label.style.backgroundColor = 'rgba(0,0,0,0.7)';
                label.style.color = 'white';
                label.style.padding = '2px 6px';
                label.style.borderRadius = '4px';
                label.style.fontSize = '10px';
                label.style.whiteSpace = 'nowrap';
                pickupEl.appendChild(label);

                pickupMarkerRef.current = new maplibregl.Marker({
                    element: pickupEl,
                    anchor: 'bottom'
                })
                    .setLngLat([pickupLocation.lng, pickupLocation.lat])
                    .addTo(map);
            }

            // Dropoff marker
            if (dropoffLocation) {
                if (dropoffMarkerRef.current) {
                    dropoffMarkerRef.current.remove();
                }

                const dropoffEl = document.createElement('div');
                dropoffEl.innerHTML = '🏁';
                dropoffEl.style.fontSize = '28px';
                dropoffEl.style.textShadow = '0 0 4px rgba(0,0,0,0.4)';
                dropoffEl.style.cursor = 'pointer';

                const label = document.createElement('div');
                label.textContent = 'Dropoff';
                label.style.position = 'absolute';
                label.style.top = '100%';
                label.style.left = '50%';
                label.style.transform = 'translateX(-50%)';
                label.style.backgroundColor = 'rgba(0,0,0,0.7)';
                label.style.color = 'white';
                label.style.padding = '2px 6px';
                label.style.borderRadius = '4px';
                label.style.fontSize = '10px';
                label.style.whiteSpace = 'nowrap';
                dropoffEl.appendChild(label);

                dropoffMarkerRef.current = new maplibregl.Marker({
                    element: dropoffEl,
                    anchor: 'bottom'
                })
                    .setLngLat([dropoffLocation.lng, dropoffLocation.lat])
                    .addTo(map);
            }

            // Fit map to show both markers
            if (pickupLocation && dropoffLocation) {
                const bounds = new maplibregl.LngLatBounds()
                    .extend([pickupLocation.lng, pickupLocation.lat])
                    .extend([dropoffLocation.lng, dropoffLocation.lat]);

                map.fitBounds(bounds, {
                    padding: 50,
                    duration: 1000
                });
            }
        },
        [pickupLocation, dropoffLocation]
    );

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

    // Create the map as soon as MapLibre has loaded. Without this effect,
    // isMapReady remains false and the waiting overlay never clears.
    useEffect(() => {
        if (!maplibreLoaded || !mapContainerRef.current || mapRef.current) return;

        if (!BAATO_STYLE_URL) {
            setMapError('Baato API key is missing');
            return;
        }

        try {
            const maplibregl = window.maplibregl;
            const map = new maplibregl.Map({
                container: mapContainerRef.current,
                style: BAATO_STYLE_URL,
                center: [85.324, 27.7172],
                zoom: 13,
                attributionControl: false
            });

            map.addControl(new maplibregl.NavigationControl(), 'top-right');
            map.addControl(new maplibregl.AttributionControl(), 'bottom-right');
            map.on('load', () => {
                setIsMapReady(true);
                map.resize();
                addPickupDropoffMarkers(map);
                if (route && !routeAddedRef.current) addRouteToMap(map, route);
            });
            map.on('error', (event: any) => {
                if (event.error?.status !== 403) {
                    console.error('Map error:', event);
                    setMapError('Unable to load the map.');
                }
            });
            mapRef.current = map;

            const markerElement = document.createElement('div');
            markerElement.style.cssText =
                'width:32px;height:32px;border-radius:50%;background:#1976d2;border:3px solid white;box-shadow:0 0 8px rgba(0,0,0,.4);';
            markerRef.current = new maplibregl.Marker({ element: markerElement, rotationAlignment: 'map' });

            return () => {
                if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
                map.remove();
                mapRef.current = null;
                markerRef.current = null;
                hasDriverPositionRef.current = false;
                routeAddedRef.current = false;
                setIsMapReady(false);
            };
        } catch (error) {
            console.error('Error initializing map:', error);
            setMapError('Failed to initialize map');
        }
    }, [maplibreLoaded, addPickupDropoffMarkers, addRouteToMap]);

    // Update route colors when driver moves
    useEffect(() => {
        if (route && isMapReady && mapRef.current && driverLocation) {
            // Re-draw the route with updated driver position
            // Reset flag so it re-adds
            routeAddedRef.current = false;
            addRouteToMap(mapRef.current, route, driverLocation);
        }
    }, [driverLocation, route, isMapReady, addRouteToMap]);
    // Initialize map
    useEffect(() => {
        if (route && isMapReady && mapRef.current && !routeAddedRef.current) {
            addRouteToMap(mapRef.current, route, driverLocation || undefined);
        }
    }, [route, isMapReady, addRouteToMap, driverLocation]);
    // When route is fetched and map is ready, add it
    useEffect(() => {
        console.log('🔍 Route state changed:', {
            route: !!route,
            routeData: route,
            isMapReady,
            hasMap: !!mapRef.current,
            routeAdded: routeAddedRef.current
        });

        if (route && isMapReady && mapRef.current && !routeAddedRef.current) {
            console.log('✅ All conditions met, adding route to map...');
            console.log('Route data for map:', route);
            addRouteToMap(mapRef.current, route);
        }
    }, [route, isMapReady, addRouteToMap]);

    // Update marker when location changes
    useEffect(() => {
        const locationData = driverLocation;

        if (!locationData || !mapRef.current || !markerRef.current || !isMapReady) {
            return;
        }

        try {
            const { lat, lng, heading } = locationData;
            const marker = markerRef.current;

            if (typeof heading === 'number') {
                marker.setRotation(heading);
            }

            if (!hasDriverPositionRef.current) {
                marker.setLngLat([lng, lat]).addTo(mapRef.current);
                hasDriverPositionRef.current = true;
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
        } catch (error) {
            console.error('Error updating marker position:', error);
        }

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [driverLocation, isMapReady]);

    const displayLocation = driverLocation;

    // Get route info
    const getRouteInfo = () => {
        if (!route || !route.routes || route.routes.length === 0) return null;
        const routeData = route.routes[0];
        return {
            distance: (routeData.distance / 1000).toFixed(1),
            duration: Math.round(routeData.duration / 60)
        };
    };

    const routeInfo = getRouteInfo();

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

            {mapError && <MapMessage message={mapError} />}
            {isLoadingRoute && <MapMessage message="Calculating route..." />}
            {(!displayLocation || !isMapReady) && !mapError && !isLoadingRoute && (
                <MapMessage message={ablyKey ? 'Waiting for driver location…' : 'Add VITE_ABLY_KEY for live tracking.'} />
            )}

            {displayLocation && isMapReady && (
                <>
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

                    {routeInfo && (
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 12,
                                left: 12,
                                bgcolor: 'background.paper',
                                px: 1.5,
                                py: 0.75,
                                borderRadius: 1,
                                boxShadow: 1,
                                zIndex: 1
                            }}
                        >
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                📏 {routeInfo.distance} km • ⏱️ {routeInfo.duration} min
                            </Typography>
                        </Box>
                    )}

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
                                Status: {displayLocation.moving ? '🚗 Moving' : '🅿️ Parked'}
                            </Typography>
                        )}
                    </Box>
                </>
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
