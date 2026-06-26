import { gql } from '@apollo/client';

export const CREATE_PAGE = gql`
    mutation CreatePage($input: CreatePageInput!) {
        createPage(input: $input) {
            _id
            title
            slug
            type
            content
            status
        }
    }
`;

export const UPDATE_PAGE = gql`
    mutation UpdatePage($updatePageId: ID!, $input: UpdatePageInput!) {
        updatePage(id: $updatePageId, input: $input) {
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
