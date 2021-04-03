import { Component } from "react";
import Input from "./input";
import Joi from "joi-browser";
class Form extends Component {
  state = {};
  validateProperty = (name, value) => {
    const propertyObj = { [name]: value };
    const propertySchema = { [name]: this.schema[name] };
    const { error } = Joi.validate(propertyObj, propertySchema);
    return error && error.details[0].message;
  };
  validate = () => {
    const {
      schema,
      state: { data },
    } = this;
    const { error } = Joi.validate(data, schema, { abortEarly: false });
    if (!error) {
      return null;
    }
    const errors = {};
    for (const detailsItem of error.details) {
      errors[detailsItem.path[0]] = detailsItem.message;
    }
    return errors;
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) {
      return;
    }
    this.doSubmit();
  };

  handleChange = ({ target: { name, value } }) => {
    const { data, errors } = this.state;
    const updatedErrors = { ...errors };
    const errorMessage = this.validateProperty(name, value);
    updatedErrors[name] = errorMessage;
    const updatedData = { ...data };
    updatedData[name] = value;

    this.setState({ data: updatedData, errors: updatedErrors });
  };

  renderInput(name, label, type = "text") {
    const { data, errors } = this.state;
    return (
      <Input
        type={type}
        label={label}
        name={name}
        onChange={this.handleChange}
        error={errors[name]}
        value={data[name]}
      />
    );
  }

  renderButton(label, className) {
    return (
      <button disabled={this.validate()} className={className}>
        {label}
      </button>
    );
  }
}

export default Form;
