import { gql } from "@apollo/client";



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