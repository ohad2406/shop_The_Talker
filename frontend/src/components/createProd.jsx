import PageHeader from "./common/pageHeader";
import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import userService from "../services/userService";
import { Redirect } from "react-router-dom";
import prodService from "../services/prodService";
import { toast } from "react-toastify";
import Select from "react-select";

class CreateProd extends Form {
  state = {
    data: {
      prodName: "",
      prodDescription: "",
      prodPrice: "",
      prodImage: "",
      prodStock: "",
      prodCat: "",
    },
    errors: {},
  };
  async doSubmit() {
    const { data } = this.state;

    await prodService.createProd(data);
    toast.success("A new product is opened");
    this.props.history.replace(`/${data.prodCat}-prod`);
  }
  schema = {
    prodName: Joi.string().min(2).max(255).required().label("Product Name"),
    prodDescription: Joi.string()
      .min(2)
      .max(1024)
      .required()
      .label("Product Description"),
    prodPrice: Joi.string().min(1).max(5).required().label("Product Price"),
    prodImage: Joi.string().min(11).max(1024).uri().label("Product Image"),
    prodStock: Joi.string().min(0).required(),
    prodCat: Joi.string().required(),
  };

  handleSelect = async (e) => {
    await this.setState({
      data: {
        ...this.state.data,
        prodCat: e ? e.value : "",
      },
    });
  };

  options1 = [
    { value: "man", label: "גבר" },
    { value: "woman", label: "אישה" },
  ];

  render() {
    if (!userService.getCurrentUser()) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container-fluid">
        <PageHeader titleText="CREATE A NEW PROD" />
        <div className="row"></div>
        <div className="row">
          <div className="col-lg-6">
            <form noValidate onSubmit={this.handleSubmit}>
              {this.renderInput("prodName", "Name")}
              {this.renderInput("prodDescription", "Description")}
              {this.renderInput("prodPrice", "Price", "number")}
              {this.renderInput("prodImage", "Image")}
              <img
                className="mb-2"
                src={this.state.data.prodImage}
                alt=""
                style={{ height: "200px", width: "200px" }}
              />
              {this.renderInput("prodStock", "Stock", "number")}
              <label>מגדר</label>
              <Select
                options={this.options1}
                className="mb-3"
                onChange={this.handleSelect}
                name="prodCat"
              />

              {this.renderButton(
                "Create Product",
                "btn btn-info form-control mb-3"
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateProd;
