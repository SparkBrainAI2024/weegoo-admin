// useDriverLocation.ts
import { useEffect, useRef, useState } from 'react';
import Ably, { Message } from 'ably';

export interface DriverLocation {
    lat: number;
    lng: number;
    heading?: number;
    speed?: number;
    ts: number;
}

const isValidLocation = (value: unknown): value is DriverLocation => {
    if (!value || typeof value !== 'object') return false;

    const { lat, lng } = value as Partial<DriverLocation>;
    return (
        typeof lat === 'number' &&
        Number.isFinite(lat) &&
        lat >= -90 &&
        lat <= 90 &&
        typeof lng === 'number' &&
        Number.isFinite(lng) &&
        lng >= -180 &&
        lng <= 180
    );
};

export function useDriverLocation(rideId: string | null, apiKey?: string) {
    const [location, setLocation] = useState<DriverLocation | null>(null);
    const clientRef = useRef<Ably.Realtime | null>(null);

    useEffect(() => {
        if (!rideId || !apiKey) return;

        const client = new Ably.Realtime({ key: apiKey });
        clientRef.current = client;
        const channel = client.channels.get(`ride:${rideId}:location`);

        channel.subscribe('location-update', (msg: Message) => {
            let data: unknown = msg.data;
            if (typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch {
                    return;
                }
            }

            if (isValidLocation(data)) {
                setLocation({ ...data, ts: typeof data.ts === 'number' ? data.ts : Date.now() });
            }
        });

        return () => {
            channel.unsubscribe();
            client.close();
            clientRef.current = null;
        };
    }, [rideId, apiKey]);

    return location;
}
