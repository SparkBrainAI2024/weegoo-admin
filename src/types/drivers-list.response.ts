import { DriverListItem } from './drivers.types';

export interface GetDriversQueryResult {
    getDrivers: {
        message: string | null;
        data: DriverListItem[];
        pagination: {
            page: number;
            limit: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            nextPage: number | null;
            previousPage: number | null;
            total: number;
        };
    };
}
