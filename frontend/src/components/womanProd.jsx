import React, { Component } from "react";
import PageHeader from "./common/pageHeader";
import prodService from "../services/prodService";
import CardShow from "./common/cardShow";
import userService from "../services/userService";
import SortProd from "./common/SortProd";
import Search from "./common/search";

class WomanProd extends Component {
  state = {
    data: {},
    prods: [],
    errors: {},
    pages: 0,
    arrPage: [],
    // user: null,
    favoritedprods: [],
    cartProd: [],
  };
  prodType = "woman";

  componentDidMount() {
    this.setDataFromServer();
  }

  async setDataFromServer() {
    // const { prods } = this.state;
    const user = userService.getCurrentUser();
    if (user) {
      const { prods, carts } = await userService.getUserInfo();
      // console.log(prods);
      this.setState({ favoritedprods: prods, cartProd: carts });
    }
    const { arrPage } = this.state;
    const { data } = await prodService.getProdsAccorToGender(
      this.prodType,
      this.state.pages
    );
    // console.log(data, arrPage);
    for (let i = 1; i <= data.numOfPages + 1; i++) {
      arrPage.push(i);
    }
    this.setState({ prods: data.prodData });
  }
  handleSortChange = (prods) => {
    this.setState({ prods });
  };
  handlePage = async ({ num }) => {
    const { data } = await prodService.getProdsAccorToGender(
      this.prodType,
      num - 1
    );
    this.setState({ prods: data.prodData });
    window.scrollTo(0, 0);
  };

  handleMoreInfo = (id) => {
    this.props.history.replace(`/detail-prod/${id}`);
  };

  /// this function handleSearch
  handleSearch = async (value) => {
    const { data } = await prodService.search(this.prodType, value);
    if (data.prodData) {
      return this.setState({ prods: data.prodData });
    }
    return this.setState({ prods: [] });
  };

  render() {
    const { prods, arrPage, favoritedprods, cartProd } = this.state;
    return (
      <div className="container">
        <PageHeader titleText="woman clothes" />
        <div className="row d-flex justify-content-around">
          <SortProd prods={prods} sortValue={this.handleSortChange} />
          <Search searchValue={this.handleSearch} />
        </div>
        <div className="row">
          {prods.length > 0 &&
            prods.map((prod) => (
              <CardShow
                key={prod._id}
                prod={prod}
                myFavoriteCards={favoritedprods}
                myCart={cartProd}
                moreInfo={() => this.handleMoreInfo(prod._id)}
              />
            ))}
          {prods.length === 0 && (
            <p className="ml-3 col-12 text-muted">
              <i>No prods , comming soon</i>
            </p>
          )}
        </div>

        {arrPage === 0 && (
          <div className="row">
            <div className="col text-center">
              {arrPage.map((num) => (
                <button
                  className="btn btn-info mb-3 ml-2"
                  key={num}
                  onClick={() => this.handlePage({ num })}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default WomanProd;
