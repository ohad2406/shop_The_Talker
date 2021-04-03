import React, { Component } from "react";
import { toast } from "react-toastify";
import UserService from "../../services/userService";

class CardShow extends Component {
  state = {
    prod: this.props.prod,
    favorite: false,
    likes: this.props.prod.numberFv,
    cart: false,
  };

  componentDidMount() {
    const { prodNumber } = this.state.prod;
    this.setState({ prod: this.props.prod });
    this.props.myFavoriteCards.filter((item) => {
      if (item === prodNumber) {
        return this.setState({ favorite: true });
      }
      return item;
    });
    this.props.myCart.filter((item) => {
      if (item === prodNumber) {
        return this.setState({ cart: true });
      }
      return item;
    });
  }

  handleFavorite = async () => {
    const user = UserService.getCurrentUser();
    if (!user) {
      return toast.warning("you need to sign in form add to favorite");
    }
    const { favorite, prod } = this.state;
    let { likes } = this.state;

    if (!favorite) {
      await UserService.favorite(prod.prodNumber);
      likes++;
      this.setState({ favorite: true, likes: likes });
    } else {
      await UserService.favorite(prod.prodNumber);
      likes--;
      this.setState({ favorite: false, likes: likes });
    }
    if (this.props.unfavorite) {
      this.props.unfavorite();
    }
  };

  handleCart = async () => {
    const user = UserService.getCurrentUser();
    if (!user) {
      return toast.warning("you need to sign in form add to cart");
    }

    const { cart, prod } = this.state;
    if (prod.prodStock <= 0) {
      return toast.dark("we dont have from this coolection right now");
    }

    if (!cart) {
      await UserService.myCart(prod.prodNumber);
      this.setState({ cart: true });
    } else {
      await UserService.myCart(prod.prodNumber);
      this.setState({ cart: false });
    }
  };

  render() {
    const { prodPrice, prodImage, prodName, prodStock } = this.state.prod;
    const { favorite, likes, cart } = this.state;
    return (
      <div className="col-md-6 col-sm-12 col-lg-4 col-xl-3 mt-3 mb-3 ">
        <div className="col-lg-12 text-center p-0 d-flex align-items-center justify-content-center">
          <img
            style={{ marginBottom: 0, maxHeight: 350,maxWidth:300 ,height:350 }}
            src={prodImage}
            className="card-img-top img-fluid position-relative mx-auto  "
            alt={prodName}
            onClick={this.props.moreInfo}
          />
          {!prodStock && (
            <h4 className="w-100 position-absolute text-danger ">
              <i className="fas fa-store-slash fa-3x"></i>
              {/* out of stock */}
            </h4>
          )}
        </div>
        <div className="card-body text-center">
          <h5 className="card-title ">{prodName}</h5>
          <p className="card-text mt-2">PRICE : {prodPrice} NIS</p>
          <p className="card-text mt-2">LIKES : {likes} </p>

          <i
            onClick={this.handleFavorite}
            className={
              !favorite
                ? "far fa-star fa-lg btn  "
                : "fas fa-star fa-lg btn text-danger"
            }
          ></i>

          <button
            className={cart ? "btn btn-dark" : "btn btn-success"}
            style={{ fontSize: "0.8em" }}
            onClick={this.handleCart}
          >
            {cart ? `REMOVE FROM CART` : `ADD TO CART`}
          </button>
        </div>
      </div>
    );
  }
}

export default CardShow;

