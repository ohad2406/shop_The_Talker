import React, { Component } from "react";
import PageHeader from "./common/pageHeader";
import userService from "../services/userService";
import CardShow from "./common/cardShow";
class FavoriteCards extends Component {
  state = {
    prods: [],
    favoritedprods: [],
    cartProd: [],
  };

  componentDidMount() {
    this.setDataFromServer();
  }

  //// this function get all prods user has favorite
  setDataFromServer = async () => {
    const { prods } = await userService.getUserInfo();
  
    this.setState({ favoritedprods: prods });
    const { carts } = await userService.getUserInfo();
    this.setState({ cartProd: carts });
    const prodsNumbres = prods.toString();
    if (prodsNumbres) {
      const { data } = await userService.getCardByNumber(prodsNumbres);
      this.setState({ prods: data });
    } else {
      this.setState({ prods: [] });
    }
  };

  handleMoreInfo = (id) => {
    this.props.history.replace(`/detail-prod/${id}`);
  };

  render() {
    const { prods, favoritedprods, cartProd } = this.state;
    return (
      <div className="container ">
        <div className="container d-flex justify-content-between">
          <div className="row ">
            <div className="col-12">
              <PageHeader titleText="Favorite prods" />
              <p>All prods you favorite are in the list below</p>
            </div>
          </div>
        </div>
        <div className="row">
          {prods.length ? (
            prods.map((card) => (
              <CardShow
                unfavorite={this.setDataFromServer}
                key={card._id}
                prod={card}
                myCart={cartProd}
                myFavoriteCards={favoritedprods}
                moreInfo={() => this.handleMoreInfo(card._id)}
              />
            ))
          ) : (
            <div className="col-12 text-muted">No cards...</div>
          )}
        </div>
      </div>
    );
  }
}

export default FavoriteCards;
