import { Stack, Typography } from "@mui/material";
import AuthCardWrapper from "../AuthCardWrapper";
import AuthWrapper1 from "../AuthWrapper1";
import AuthLogin from "../auth-forms/AuthLogin";

export const LoginTest = () => {
  return (
    <AuthWrapper1>
      <AuthCardWrapper page="login">
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="h3">Hi, Welcome Back</Typography>
            <Typography variant="body1" color="text.secondary">Login to your account</Typography>
          </Stack>
          <AuthLogin />
        </Stack>
      </AuthCardWrapper>
    </AuthWrapper1>
  );
};