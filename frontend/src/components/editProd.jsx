import PageHeader from "./common/pageHeader";
import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import prodService from "../services/prodService";
import { toast } from "react-toastify";
import Select from "react-select";

class EditProd extends Form {
  state = {
    data: {
      prodName: "",
      prodDescription: "",
      prodPrice: "",
      prodImage: "",
      prodStock: "",
      prodCat: "",
      _id: "",
    },
    errors: {},
  };
  async componentDidMount() {
    const id = this.props.match.params.id;
    const { data } = await prodService.getOneProd(id);
    this.setState({ data: this.InsertInfo(data) });
  }

  InsertInfo(prod) {
    // console.log(prod);
    return {
      _id: prod._id,
      prodName: prod.prodName,
      prodDescription: prod.prodDescription,
      prodPrice: prod.prodPrice,
      prodImage: prod.prodImage,
      prodStock: prod.prodStock,
      prodCat: prod.prodCat,
    };
  }

  doSubmit = async () => {
    const { data } = this.state;
    const id = data._id;
    await prodService.updateProd(id, data);
    toast.success("Card is Updated");
    this.props.history.replace(`/${data.prodCat}-prod`);
  };

  handleSelect = async (e) => {
    await this.setState({
      data: {
        ...this.state.data,
        prodCat: e ? e.value : "",
      },
    });
  };

  schema = {
    prodName: Joi.string().min(2).max(255).required().label("Product Name"),
    prodDescription: Joi.string()
      .min(2)
      .max(1024)
      .required()
      .label("Product Description"),
    prodPrice: Joi.number().min(1).required().label("Product Price"),
    prodImage: Joi.string()
      .min(11)
      .max(1024)
      .uri()
      .allow("")
      .label("Product Image"),
    prodStock: Joi.number().min(0).required(),
    prodCat: Joi.string().required(),
    _id: Joi.string(),
  };

  render() {
    const options = [
      { value: "man", label: "גבר" },
      { value: "woman", label: "אישה" },
    ];
    let { prodCat } = this.state.data;
    return (
      <div className="container-fluid">
        <PageHeader titleText="update the prodact" />
        <div className="row"></div>
        <div className="row">
          <div className="col-lg-6">
            <form noValidate onSubmit={this.handleSubmit}>
              {this.renderInput("prodName", "Product Name")}
              {this.renderInput("prodDescription", "Product Description")}
              {this.renderInput("prodPrice", "Product Price", "number")}
              {this.renderInput("prodImage", "Product Image")}
              <img
                className=""
                src={this.state.data.prodImage}
                alt={this.state.data.prodName}
                style={{ height: "200px", width: "200px" }}
              />
              {this.renderInput("prodStock", "Product Stock", "number")}
              <label className="mt-1">GENDER</label>

              <Select
                value={options.find((item) => item.value === prodCat)}
                className="mb-3 "
                onChange={this.handleSelect}
                name="prodCat"
                options={options}
              />

              {this.renderButton("Update Product", "btn btn-info mb-3")}
              <button className="btn btn-danger ml-2 mb-3">
                <Link className="text-white" to="/my-prods">
                  Cancel
                </Link>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditProd;
