"use client";
import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { useSnackbar } from "@/hooks/useSnackbar";
import { useLogin } from "@/lib/swr-services/login";
import { LoginProps, loginSchema } from "@/lib/zod";
import AppTheme from "@/providers/AppTheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
// import Checkbox from '@mui/material/Checkbox';
import FormControl from "@mui/material/FormControl";
// import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from "@mui/material/FormLabel";
// import Link from '@mui/material/Link';
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// import { GoogleIcon, FacebookIcon, SitemarkIcon } from "./CustomIcons";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const Login: React.FC = () => {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const [, startTransition] = React.useTransition();

  // api
  const { trigger } = useLogin();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    resolver: zodResolver(loginSchema),
    defaultValues: {},
  });

  const onSubmit = async (data: LoginProps) => {
    const newData = {
      userId: data.userId,
      password: data.password,
    };
    await trigger(newData, {
      onSuccess: (res) => {
        openSnackbar(res?.data?.message, "success");
        startTransition(() => {
          // router.push('/admin/dashboard'); //TODO:
          router.push("/admin/country");
        });
      },
    });
  };

  return (
    <AppTheme>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Stack
          mr="auto"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
          sx={{
            gap: "32px",
          }}
        >
          <Image
            src="/uploads/images/admin/admin-logo.png"
            width={180}
            height={55}
            alt="logo"
          />
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{
                width: "100%",
                fontSize: "clamp(2rem, 10vw, 2.15rem)",
                textAlign: "center",
              }}
            >
              Sign in
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">User ID</FormLabel>
                <Controller
                  control={control}
                  name="userId"
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <TextField
                        placeholder="Enter Email or User ID"
                        error={!!errors.userId}
                        helperText={errors?.userId?.message || ""}
                        {...field}
                      />
                    );
                  }}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => {
                    return (
                      <TextField
                        type="password"
                        placeholder="Enter your password"
                        error={!!errors.password}
                        helperText={errors?.password?.message || ""}
                        {...field}
                      />
                    );
                  }}
                />
              </FormControl>

              {/* <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />  
              //TODO:
              */}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={handleSubmit(onSubmit)}
              >
                Login
              </Button>
              {/* <Typography sx={{ textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <span>
                  <Link
                    href="/material-ui/getting-started/templates/sign-in/"
                    variant="body2"
                    sx={{ alignSelf: 'center' }}
                  >
                    Sign up
                  </Link>
                </span>
              </Typography> */}
            </Box>
          </Card>
        </Stack>
      </Box>
    </AppTheme>
  );
};

export default Login;
