import React, { Component } from "react";
import PageHeader from "./common/pageHeader";
import userService from "../services/userService";

class MyCart extends Component {
  state = {
    prods: [],
    cartProd: [],
    totalPrice: 0,
  };

  componentDidMount() {
    this.setDataFromServer();
  }

  //// this function get all prods user has favorite
  setDataFromServer = async () => {
    let { totalPrice } = this.state;
    const { carts } = await userService.getUserInfo();
    this.setState({ cartProd: carts });
    const prodsNumbres = carts.toString();
    if (prodsNumbres) {
      const { data } = await userService.getCardByNumber(prodsNumbres);
      this.setState({ prods: data });
      data.map((prod) => {
        return (totalPrice += prod.prodPrice);
      });
      this.setState({ totalPrice });
    } else {
      this.setState({ prods: [] });
    }
  };

  render() {
    const { prods, totalPrice } = this.state;
    return (
      <div className="container ">
        <div className="container d-flex justify-content-between">
          <div className="row ">
            <div className="col-12">
              <PageHeader titleText="MT CART" />
              <p>All prods you add to the cart</p>
            </div>
          </div>
        </div>
        <div className="row">
          {prods.length ? (
            <>
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">image</th>
                    <th scope="col">name</th>
                    <th scope="col">description</th>
                    <th scope="col">price</th>
                  </tr>
                </thead>
                <tbody>
                  {prods.map((prod, i) => (
                    <tr key={prod._id}>
                      <td>{i + 1}</td>
                      <td>
                        <img
                          width="50px"
                          height="50px"
                          style={{ padding: 0, margin: 0 }}
                          src={prod.prodImage}
                          alt={prod.prodNmae}
                        />
                      </td>
                      <td>{prod.prodName} </td>
                      <td>{prod.prodDescription}</td>
                      <td>{prod.prodPrice} ₪</td>
                    </tr>
                  ))}
                </tbody>
              </table>


              <div className="row d-flex justify-content-end align-items-center w-100">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-12 text-right">
                      <b>
                        <span className="titleindropdown">TOTAL PRICE: </span>
                        <span
                          className="titlepriceindropdown totalclass"
                          id="total_final_span">
                          <span className="whole-price-pp">
                            <span className="pp-price-p currency_sign">₪</span>
                            <span className="price-area-pp pp-price-p hp-price-size">
                            {totalPrice}
                            </span>
                            <button className="btn btn-success ml-3">NEXT</button>
                          </span>
                        </span>
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div> you dont have any prods in the cart </div>
          )}
        </div>
      </div>
    );
  }
}

export default MyCart;
