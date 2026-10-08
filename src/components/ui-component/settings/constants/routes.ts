const BASE = '/settings/location';

export const LOCATION_ROUTES = {
    list: BASE,
    new: `${BASE}/new`,
    edit: (locationId: string) => `${BASE}/${locationId}/edit`,
    newStation: (locationId: string) => `${BASE}/${locationId}/stations/new`,
    editStation: (locationId: string, stationId: string) => `${BASE}/${locationId}/stations/${stationId}/edit`
};
