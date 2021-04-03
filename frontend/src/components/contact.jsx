import PageHeader from "./common/pageHeader";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputFormik from "./common/InputFormik";
import { useHistory } from "react-router-dom";
import sendEmail from "../services/contactUsService";
/////////// Formik initialValues
const initialValues = {
  email: "",
  message: "",
  subject: "",
};

////////// schema reagex Email
const emailRegExp = /^[a-z0-9._\-+]{2,50}@[a-z\-0-9]+(\.[a-z]{2,10})+$/i;

/////////// Formik Schema
const contactUsSchema = Yup.object({
  email: Yup.string()
    .lowercase()
    .matches(emailRegExp, `email is not valid`)
    .required(`this required`),
  subject: Yup.string()
    .min(2, `Subject must be longer than 2 characters`)
    .max(125, `Subject must be shorter than 125 characters`)
    .required(`this required`),
  message: Yup.string()
    .min(2, `message must be longer than 2 characters`)
    .max(1025, `message must be shorter than 1025 characters`)
    .required(`this required`),
});

const ContactUs = () => {
  const history = useHistory();
  return (
    <div>
      <PageHeader
        titleText="CONTACT"
        subtext="SEND A NEW MESSAGE FOR AS"
      ></PageHeader>
      <Formik
        initialValues={initialValues}
        validationSchema={contactUsSchema}
        onSubmit={async (values, { setFieldError }) => {
          try {
            const { message, subject, email } = values;
            const dataBody = { message, subject, email };
            await sendEmail(dataBody);
            toast.success(`email sent`);
            history.push(`/`);
          } catch (err) {
            if (err.response && err.response.status === 400) {
              if (err.response.data.error) {
                setFieldError("email", err.response.data.error);
              }
              if (err.response.data.errors.email) {
                setFieldError("email", err.response.data.errors.email);
              }
              if (err.response.data.errors.subject) {
                setFieldError("subject", err.response.data.errors.subject);
              }
              if (err.response.data.errors.message) {
                setFieldError("message", err.response.data.errors.message);
              }
            }
          }
        }}
      >
        {({ dirty, isValid, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="container w-50 mt-5 ">
            <InputFormik name="email" label="Email" />
            <InputFormik name="subject" label="Subject" />
            <InputFormik component="textarea" name="message" label="Message" />
            <div className="d-flex justify-content-center w-100">
              <button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={!dirty || !isValid}
                className="btn btn-primary"
              >
                Send
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactUs;
