import PageHeader from "./common/pageHeader";
import { toast } from "react-toastify";
import userService from "../services/userService";
import { Link, Redirect } from "react-router-dom";
import InputFormik from "./common/InputFormik";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const initialValues = {
  email: "",
  password: "",
};

////////// Schema Reagex Password
const lowerCaseRegExp = /(?=.*[a-z])/;
const upperCaseRegExp = /(?=.*[A-Z])/;
const numericRegExp = /(?=.*[0-9])/;

/////////// Formik Schema
const Schema = Yup.object({
  email: Yup.string()
    .min(6, `email must be longer at least 6 characters`)
    .max(255, `email must be shorter than 255 characters`)
    .required(`this required`)
    .email(),
  password: Yup.string()
    .matches(lowerCaseRegExp, `one lowerCase Required!`)
    .matches(upperCaseRegExp, `one upperCase Required!`)
    .matches(numericRegExp, `one number Required!`)
    .min(6, `password must be longer than 8 characters`)
    .max(1024, `password must be shorter than 1024 characters`)
    .required(`this required`),
});

const SignIn = () => {
  if (userService.getCurrentUser()) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <PageHeader titleText="signin"></PageHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={Schema}
        onSubmit={async (values, { setFieldError }) => {
          try {
            const { email, password } = values;
            await userService.login(email, password);
            toast.success(`you are login`);
            window.location = "/";
          } catch (err) {
            if (err.response && err.response.status === 400) {
              if (err.response.data.errors.password) {
                setFieldError("password", err.response.data.errors.password);
              }
              if (err.response.data.error.email) {
                setFieldError("email", err.response.data.errors.email);
              }
            }
          }
        }}
      >
        {({ dirty, isValid, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="container w-50 mt-5 ">
            <InputFormik name="email" label="*Email" />
            <InputFormik type="password" name="password" label="*Password" />
            <div className="d-flex justify-content-center w-100">
              <button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={!dirty || !isValid}
                className="btn btn-primary form-control"
              >
                SIGN IN
              </button>
            </div>

            <div className="mt-4 mb-4">
              <span style={{ fontSize: "1.5em" }}>
                New CLIENT? CLICK HERE TO SIGNUP
              </span>

              <Link to="/signup" className="btn btn-dark mt-2 form-control">
                SIGN UP
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
