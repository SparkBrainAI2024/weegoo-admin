import { gql } from '@apollo/client';

export const GET_PAGE_BY_SLUG = gql`
    query PageBySlug($slug: String!) {
        pageBySlug(slug: $slug) {
            _id
            title
            slug
            type
            content
            status
            publishedAt
            createdAt
            updatedAt
        }
    }
`;
export const GET_PAGES = gql`
    query Pages($paginationInput: PaginationInputOnly!) {
        pages(paginationInput: $paginationInput) {
            data {
                status
                title
                content
                type
                slug
                updatedAt
            }
            message
            pagination {
                hasNextPage
                hasPreviousPage
                limit
                nextPage
                previousPage
                total
                page
            }
        }
    }
`;
