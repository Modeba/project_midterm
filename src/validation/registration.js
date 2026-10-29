import * as yup from "yup";

export const registrationSchema = yup.object({
  firstName: yup.string().trim().required("Please enter your first name."),
  lastName: yup.string().trim().required("Please enter your last name."),
  username: yup.string().trim()
    .required("Please enter your username.")
    .min(3, "Username must contain at least 3 characters.")
    .matches(/^\S+$/, "Username cannot contain spaces."),
  email: yup.string().trim()
    .required("Please enter your email address.")
    .email("Please enter a valid email address."),
  password: yup.string()
    .required("Please enter your password.")
    .min(8, "Password must contain at least 8 characters."),
  confirmPassword: yup.string()
    .required("Please confirm your password.")
    .oneOf([yup.ref("password")], "Passwords must match."),
});
