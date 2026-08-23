// useDriverLocation.ts
import { useEffect, useRef, useState } from 'react';
import Ably from 'ably';

export interface DriverLocation {
    lat: number;
    lng: number;
    heading?: number;
    speed?: number;
    ts: number;
}

export function useDriverLocation(rideId: string | null, apiKey: string) {
    const [location, setLocation] = useState<DriverLocation | null>(null);
    const clientRef = useRef<Ably.Realtime | null>(null);

    useEffect(() => {
        if (!rideId) return;

        const client = new Ably.Realtime({ key: apiKey });
        clientRef.current = client;
        const channel = client.channels.get(`ride:${rideId}:location`);

        channel.subscribe('location-update', (msg: Ably.Types.Message) => {
            setLocation(msg.data as DriverLocation);
        });

        return () => {
            channel.unsubscribe();
            client.close();
        };
    }, [rideId, apiKey]);

    return location;
}
