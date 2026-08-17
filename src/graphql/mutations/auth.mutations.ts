import { gql } from '@apollo/client';

export const SIGN_IN = gql`
    mutation adminSignIn($input: AdminSignInInput!) {
        adminSignIn(input: $input) {
            accessToken
            refreshToken
            admin {
                email
                id
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

// graphql/mutations/auth.ts
export const VERIFY_OTP = gql`
    mutation adminVerifyOtp($input: AdminVerifyOtpInput!) {
        adminVerifyOtp(input: $input) {
            success
            message
            resetPasswordToken
        }
    }
`;

export const RESET_PASSWORD = gql`
    mutation adminResetPassword($input: AdminResetPasswordInput!) {
        adminResetPassword(input: $input) {
            success
            message
        }
    }
`;
