import { Field, ErrorMessage } from "formik";
const InputFormik = ({ label, name, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Field {...rest} name={name} id={name} className="form-control" />
      <ErrorMessage name={name}>
        {(msg) => <span style={{ color: "red" }}>{msg}</span>}
      </ErrorMessage>
    </div>
  );
};

export default InputFormik;
