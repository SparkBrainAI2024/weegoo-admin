import { gql } from '@apollo/client';

export const GET_EMAIL_TEMPLATE_BY_ID = gql`
    query EmailTemplate($emailTemplateId: ID!) {
        emailTemplate(id: $emailTemplateId) {
            _id
            createdAt
            updatedAt
            deletedAt
            deleted
            title
            slug
            pageContent
            status
        }
    }
`;

export const GET_EMAIL_TEMPLATE_BY_SLUG = gql`
    query EmailTemplateBySlug($slug: String!) {
        emailTemplateBySlug(slug: $slug) {
            _id
            createdAt
            updatedAt
            deletedAt
            deleted
            title
            slug
            pageContent
            status
        }
    }
`;
export const GET_EMAIL_TEMPLATES = gql`
    query EmailTemplates($paginationInput: PaginationInputOnly!) {
        emailTemplates(paginationInput: $paginationInput) {
            message
            data {
                _id
                createdAt
                updatedAt
                deletedAt
                deleted
                title
                slug
                pageContent
                status
            }
            pagination {
                page
                limit
                hasNextPage
                hasPreviousPage
                nextPage
                previousPage
                total
            }
        }
    }
`;