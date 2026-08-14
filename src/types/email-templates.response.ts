export interface EmailTemplatesResponse {
    emailTemplates: {
        data: EmailTemplate[];
        message: string | null;
        pagination: Pagination;
    };
}

export interface EmailTemplateBySlugResponse {
    emailTemplateBySlug: EmailTemplate;
}

export interface EmailTemplateByIdResponse {
    emailTemplate: EmailTemplate;
}

export const enum EMAIL_TEMPLATE_STATUS {
    PUBLISHED = 'PUBLISHED',
    DRAFT = 'DRAFT'
}

export interface EmailTemplate {
    _id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deleted: boolean;
    title: string;
    slug: string;
    pageContent: string;
    status: EMAIL_TEMPLATE_STATUS;
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

export interface CreateEmailTemplateResponse {
    createEmailTemplate: {
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
