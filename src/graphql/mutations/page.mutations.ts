import { gql } from "@apollo/client";

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
