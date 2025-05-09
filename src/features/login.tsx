import { Lock, Mail } from "@mui/icons-material";
import { Box, FormControl, FormHelperText, InputAdornment, TextField, Typography } from "@mui/material";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { colors } from "../assets/styles/Owntheme";
import useGetLogin from "../services/post/useGetLogin";
import CustomButton from "../shared/components/Button/customButton";
import { loginValidationSchema } from "../shared/validationSchemas/validationsSchema";
import { PROJECT_NAME } from "../shared/constants/constants";

interface FormData {
  username: string;
  password: string;
}

const Login = () => {
  const {
    control,
    formState: { errors, touchedFields },
    handleSubmit,
  } = useForm<FormData>({
    mode: "onTouched",
    resolver: yupResolver(loginValidationSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate: handleLogin, isPending } = useGetLogin();

  const onSubmit = (values: FormData) => {
    handleLogin(values);
  };

  return (
    <Box className="w--full display-flex-center full-screen flex--column">
      <Typography
        component={"h1"}
        className="text--uppercase font-all-pro"
        sx={{
          letterSpacing: "3px",
          fontSize: "32px",
          color: colors.primary.main,
        }}
      >
        {PROJECT_NAME}
      </Typography>
      <Box className="bg--white w--full mt--15" sx={{ maxWidth: "380px", borderRadius: "10px", border: "2px solid #ECECEC" }}>
        <Box className="display-flex-center flex--column" sx={{ margin: "10px" }}>
          <Typography
            component={"h1"}
            className="font--semi-bold"
            sx={{
              fontSize: "24px",
              margin: "50px 0",
              color: colors.primary.main,
            }}
          >
            Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} className="display-flex-center flex--column">
            <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
              <FormHelperText
                id="outlined-weight-helper-text"
                className="m--0 font--medium"
                sx={{
                  color: colors.black.main,
                }}
              >
                Username
              </FormHelperText>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label=""
                    type="text"
                    id="outlined-start-adornment-username"
                    sx={{ m: 1, width: "30ch", margin: 0 }}
                    InputProps={{
                      sx: {
                        borderRadius: "18px",
                      },
                      placeholder: "Enter Your Username",
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      style: {
                        padding: "9px 15px 9px 5px",
                      },
                    }}
                    error={Boolean(errors.username && touchedFields.username)}
                    helperText={errors.username && touchedFields.username ? errors.username.message : ""}
                  />
                )}
              />
            </FormControl>
            <FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
              <FormHelperText
                id="outlined-weight-helper-text"
                className="m--0 font--medium"
                sx={{
                  color: colors.black.main,
                }}
              >
                Password
              </FormHelperText>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label=""
                    type="password"
                    id="outlined-start-adornment-password"
                    sx={{ m: 1, width: "30ch", margin: 0 }}
                    InputProps={{
                      sx: {
                        borderRadius: "18px",
                      },
                      placeholder: "***********",
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      style: {
                        padding: "9px 15px 9px 5px",
                      },
                    }}
                    error={Boolean(errors.password && touchedFields.password)}
                    helperText={errors.password && touchedFields.password ? errors.password.message : ""}
                  />
                )}
              />
            </FormControl>
            <Box
              sx={{
                margin: "30px 16px",
                gap: "5px",
                width: "30ch",
              }}
              className="flex flex--column align-items--end"
            >
              <CustomButton
                loading={isPending}
                loadingPosition="center"
                variant="contained"
                type="submit"
                size="large"
                style={{
                  borderRadius: "25px",
                  width: "100%",
                }}
                text="Login"
              />
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
