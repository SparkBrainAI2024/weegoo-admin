export interface PagesResponse {
    pages: {
        data: Page[];
        message: string | null;
        pagination: Pagination;
    };
}

export interface Page {
    status: string;
    title: string;
    content: string;
    type: string;
    slug:string;
    updatedAt:string;
}

export interface Pagination {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
    nextPage: number | null;
    previousPage: number | null;
    total: number;
    page: number;
}