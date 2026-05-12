import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation SignIn($input: EmailSignInInput!) {
    signIn(input: $input) {
      accessToken
      refreshToken
      user{
      email
      }
      
    }
  }
`;

