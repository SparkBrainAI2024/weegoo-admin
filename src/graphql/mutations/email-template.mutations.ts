import { gql } from '@apollo/client';

export const CREATE_EMAIL_TEMPLATE = gql`
    mutation CreateEmailTemplate($input: CreateEmailTemplateInput!) {
        createEmailTemplate(input: $input) {
            _id
            createdAt
            deleted
            deletedAt
            pageContent
            slug
            status
            title
            updatedAt
        }
    }
`;

export const UPDATE_EMAIL_TEMPLATE = gql`
    mutation UpdateEmailTemplate($updateEmailTemplateId: ID!, $input: UpdateEmailTemplateInput!) {
        updateEmailTemplate(id: $updateEmailTemplateId, input: $input) {
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

export const PUBLISH_EMAIL_TEMPLATE = gql`
    mutation PublishEmailTemplate($publishEmailTemplateId: ID!) {
        publishEmailTemplate(id: $publishEmailTemplateId) {
            _id
            title
            slug
            pageContent
            status
            publishedAt
            createdAt
            updatedAt
        }
    }
`;
