// hooks/useDriverLocation.ts
import { useEffect, useRef, useState } from 'react';
import * as Ably from 'ably';

export interface DriverLocation {
    lat: number;
    lng: number;
    heading?: number;
    speed?: number;
    ts: number;
    driverId?: string;
    moving?: boolean;
}

export function useDriverLocation(driverId: string | null, apiKey?: string) {
    const [location, setLocation] = useState<DriverLocation | null>(null);
    const clientRef = useRef<Ably.Realtime | null>(null);

    useEffect(() => {
        if (!driverId || !apiKey) {
            console.log('No driverId or apiKey provided');
            return;
        }

        const channelName = `WG-DRIVER-${driverId}-driver-location`;
        console.log('📡 Subscribing to channel:', channelName);

        try {
            const realtime = new Ably.Realtime(apiKey);
            clientRef.current = realtime;

            const channel = realtime.channels.get(channelName);

            // Bug was also here: subscribing to a specific event name
            // (`WG-DRIVER-$<id>-driver-location`, with a stray `$` that was never
            // interpolated) meant the filter never matched what the publisher
            // actually sends. Subscribing with no event name catches every
            // message on the channel, then we validate the payload shape
            // ourselves — this mirrors the "static" version that was working.
            channel.subscribe((message) => {
                console.log('📨 Received message:', message.name, message.data);
                const data = message.data;

                if (data && typeof data.lat === 'number' && typeof data.lng === 'number') {
                    setLocation({
                        lat: data.lat,
                        lng: data.lng,
                        ts: Date.now(),
                        heading: data.heading || 0,
                        moving: data.moving || false,
                        driverId: data.driverId
                    });
                }
            });

            return () => {
                channel.unsubscribe();
                realtime.close();
                clientRef.current = null;
            };
        } catch (error) {
            console.error('Error initializing Ably:', error);
            return () => {
                if (clientRef.current) {
                    clientRef.current.close();
                    clientRef.current = null;
                }
            };
        }
    }, [driverId, apiKey]);

    return location;
}
