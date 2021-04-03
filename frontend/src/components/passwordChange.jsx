import PageHeader from "./common/pageHeader";
import { toast } from "react-toastify";
import userService from "../services/userService";
import { Link, useHistory } from "react-router-dom";
import InputFormik from "./common/InputFormik";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const initialValues = {
  password: "",
  newPassword: "",
  confirmPassword: "",
};

////////// Schema Reagex Password
const lowerCaseRegExp = /(?=.*[a-z])/;
const upperCaseRegExp = /(?=.*[A-Z])/;
const numericRegExp = /(?=.*[0-9])/;

/////////// Formik Schema
const Schema = Yup.object({
  password: Yup.string()
    .max(1024, `password must be shorter than 1024 characters`)
    .required(`this required`),
  newPassword: Yup.string()
    .matches(lowerCaseRegExp, `one lowerCase Required!`)
    .matches(upperCaseRegExp, `one upperCase Required!`)
    .matches(numericRegExp, `one number Required!`)
    .min(6, `password must be longer than 8 characters`)
    .max(1024, `password must be shorter than 1024 characters`)
    .required(`this required`),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "the password must be the same!")
    .required(`this required`),
});

const PassowrdChange = () => {
  const history = useHistory();

  return (
    <div>
      <PageHeader titleText="Update your name"></PageHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={Schema}
        onSubmit={async (values, { setFieldError }) => {
          try {
            const { password, newPassword } = values;
            await userService.passChange(password, newPassword);
            toast.success(`updated password`);
            history.push(`/`);
          } catch (err) {
            if (err.response && err.response.status === 400) {
              if (err.response.data.errors.password) {
                setFieldError("password", err.response.data.errors.password);
              }
              if (err.response.data.error.newPassword) {
                setFieldError(
                  "newpassword",
                  err.response.data.errors.newPassword
                );
                setFieldError(
                  "confirmPassword",
                  err.response.data.errors.newPassword
                );
              }
            }
          }
        }}
      >
        {({ dirty, isValid, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="container w-50 mt-5 ">
            <InputFormik type="password" name="password" label="*Password" />
            <InputFormik
              type="password"
              name="newPassword"
              label="*New Password"
            />
            <InputFormik
              type="password"
              name="confirmPassword"
              label="*Confirm Password"
            />
            <div className="d-flex justify-content-center w-100">
              <button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={!dirty || !isValid}
                className="btn btn-primary"
              >
                CHANCE PASSWORD
              </button>
              <Link className="btn btn-danger ml-3" to=".">
                CANCEL
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PassowrdChange;
