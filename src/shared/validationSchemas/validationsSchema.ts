import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  username: Yup.string().required("User name is required !"),
  password: Yup.string().required("Password is required !"),
});
