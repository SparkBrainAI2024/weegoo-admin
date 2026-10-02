export type BusStationStatus = 'active' | 'inactive';

export interface BusStation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    status: BusStationStatus;
}

export interface Location {
    id: string;
    name: string;
    busStations: BusStation[];
}
