import { gql } from "@apollo/client";



export const GET_OCCASIONS = gql`
  query Occasion($paginationInput: PaginationInputOnly!) {
    occasion(paginationInput: $paginationInput) {
      occasionName
      _id
    }
  }
`;