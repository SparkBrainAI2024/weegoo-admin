import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation adminSignIn($input: AdminSignInInput!) {
    adminSignIn(input: $input) {
      accessToken
      refreshToken
      admin{
      email
      }
      
    }
  }
`;


export const FORGOT_PASSWORD = gql`
  mutation adminForgotPassword($input: AdminForgotPasswordInput!) {
    adminForgotPassword(input: $input) {
      success
      message
    }
  }
`;
