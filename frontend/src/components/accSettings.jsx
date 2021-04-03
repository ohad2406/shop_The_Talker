import { useEffect, useState } from "react";
import PageHeader from "./common/pageHeader";
import { toast } from "react-toastify";
import userService from "../services/userService";
import { Link, useHistory } from "react-router-dom";
import InputFormik from "./common/InputFormik";
import { Form, Formik } from "formik";
import * as Yup from "yup";

/////////// Formik Schema
const Schema = Yup.object({
  name: Yup.string()
    .min(2, `message must be longer than 2 characters`)
    .max(255, `message must be shorter than 255 characters`)
    .required(`this required`),
});

const AccSettings = () => {
  const [initialValues, setInitialValues] = useState({
    name: "",
  });
  useEffect(() => {
    window.scroll(0, 0);
    async function userInfo() {
      const data = await userService.getUserInfo();

      setInitialValues({ name: data.name });
    }
    userInfo();
  }, []);

  const history = useHistory();

  return (
    <div>
      <PageHeader titleText="Update your name"></PageHeader>
      <Formik
        enableReinitialize="true"
        initialValues={initialValues}
        validationSchema={Schema}
        onSubmit={async (values, { setFieldError }) => {
          try {
            const { name } = values;
            await userService.changeName({ name });
            toast.success(`updated name`);
            history.push(`/`);
          } catch (err) {
            if (err.response && err.response.status === 400) {
              if (err.response.data.error) {
                setFieldError("name", err.response.data.error);
              }
            }
          }
        }}
      >
        {({ dirty, isValid, handleSubmit, values }) => (
          <Form onSubmit={handleSubmit} className="container w-50 mt-5 ">
            <InputFormik name="name" label="Name" />
            <div className="d-flex justify-content-center w-100">
              <button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={!dirty || !isValid}
                className="btn btn-primary"
              >
                CHANGE NAME
              </button>
              <Link
                className="btn btn-info ml-3"
                to="/settings/edit/passChange"
              >
                CHANCE PASSWORD
              </Link>
              <Link className="btn btn-danger ml-3" to="/">
                CANCEL
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AccSettings;
