import React from "react";
import Form from "./common/form";
import prodService from "../services/prodService";
import { Link } from "react-router-dom";
import "../style/details.css";

class DetailsProd extends Form {
  state = {
    prod: {
      prodName: "",
      prodDescription: "",
      prodPrice: "",
      prodImage: "",
      prodStock: "",
      prodCat: "",
      _id: "",
    },
    errors: {},
    stock: [],
  };
  async componentDidMount() {
    let { stock } = this.state;
    const id = this.props.match.params.id;
    const { data } = await prodService.getOneProd(id);
    for (let i = 1; i <= data.prodStock; i++) {
      stock.push(i);
    }
    this.setState({ prod: this.InsertInfo(data) });
  }

  InsertInfo(prod) {
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

  render() {
    const { prod } = this.state;

    return (
      <div className="product">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="product_image_slider_container">
                <img
                  src={prod.prodImage}
                  alt={prod.prodName}
                  className="mt-4 mb-3"
                  style={{ maxWidth: "100%" }}
                />
              </div>
            </div>
            <div className="col-lg-6 product_col d-flex justify-content-center align-items-center">
              <div className="product_info">
                <div className="product_name">{prod.prodName}</div>
                <div className="product_description">
                  {prod.prodDescription}
                </div>
                <div className="product_category">
                  <span className="h7 text-success">
                    {prod.prodStock > 0 && (
                      <p className="text-success mb-1"> In stock</p>
                    )}
                    {prod.prodStock === 0 && (
                      <p className="text-danger mb-1"> Out of stock </p>
                    )}
                  </span>
                </div>
                <div className="product_rating_container d-flex flex-row align-items-center justify-content-start">
                  <div className="product_reviews">
                    4.7
                    <b>
                      <i className="fas fa-star"></i>
                    </b>
                  </div>
                </div>
                <div className="product_price">
                  <span className="price-title">Price :</span>
                  <span className="price color-price-waanbii">
                    {prod.prodPrice}₪
                  </span>
                </div>
                <Link
                  className="text-white btn btn-primary mb-3 "
                  to={`/${prod.prodCat}-prod`}
                >
                  BACK
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DetailsProd;
