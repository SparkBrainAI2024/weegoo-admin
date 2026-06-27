export interface PagesResponse {
    pages: {
        data: Page[];
        message: string | null;
        pagination: Pagination;
    };
}

export interface PageBySlugResponse {
    pageBySlug: Page;
}

export const enum PAGE_STATUS {
    PUBLISHED = 'PUBLISHED',
    DRAFT = 'DRAFT'
}

export interface Page {
    _id: string;
    status: PAGE_STATUS;
    title: string;
    content: string;
    type: string;
    slug: string;
    updatedAt: string;
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

export interface CreatePageResponse {
    createPage: {
        _id: string;
        title: string;
        slug: string;
        type: string;
        content: string;
        status: string;
        publishedAt: string;
        createdAt: string;
        updatedAt: string;
    };
}
