import React, { Component } from "react";
import prodService from "../services/prodService";
import CardShow from "./common/cardShow";
import userService from "../services/userService";

class Home extends Component {
  state = {
    manProds: [],
    womanProds: [],
    favoritedprods: [],
    cartProd: [],
  };

  componentDidMount() {
    this.setDataFromServer();
  }

  async setDataFromServer() {
    const user = userService.getCurrentUser();
    if (user) {
      const { prods, carts } = await userService.getUserInfo();
     
      this.setState({ favoritedprods: prods, cartProd: carts });
    }
    const man = await prodService.getProdsAccorToGender("man", 0, 3, "true");
    this.setState({ manProds: man.data.prodData });
    const woman = await prodService.getProdsAccorToGender(
      "woman",
      0,
      3,
      "true"
    );
    this.setState({ womanProds: woman.data.prodData });
  }

  handleMoreInfo = (id) => {
    this.props.history.replace(`/detail-prod/${id}`);
  };

  render() {
    const { manProds, womanProds, favoritedprods, cartProd } = this.state;
    return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 mt-4 header_home ">
            <h1 className="text-center">T H E</h1>
            <h1 className="text-center">T A L K E R</h1>
            <p className="text-center " style={{ fontSize: 27 }}>
              I'm a new designer who loves fashion and design,
              <span className="d-block">
                I hope you connect and love the clothes I created
              </span>
            </p>
          </div>
        </div>
        <div className="container " style={{ marginTop: 70 }}>
          <h1 style={{ textAlign: "center" }}> new collection of womman</h1>
          <div className="row d-flex justify-content-center align-items-center">
            {womanProds.length > 0 &&
              womanProds.map((prod) => (
                <CardShow
                  key={prod._id}
                  prod={prod}
                  myFavoriteCards={favoritedprods}
                  myCart={cartProd}
                  moreInfo={() => this.handleMoreInfo(prod._id)}
                />
              ))}
            {womanProds.length === 0 && (
              <p className="ml-3 col-12 text-muted">
                <i>No prods , comming soon</i>
              </p>
            )}
          </div>
          <h1 style={{ textAlign: "center", marginTop: 50 }}>
            {" "}
            new collection of man
          </h1>
          <div className="row d-flex justify-content-center align-items-center">
            {manProds.length > 0 &&
              manProds.map((prod) => (
                <CardShow
                  key={prod._id}
                  prod={prod}
                  myFavoriteCards={favoritedprods}
                  myCart={cartProd}
                  moreInfo={() => this.handleMoreInfo(prod._id)}
                />
              ))}
            {manProds.length === 0 && (
              <p className="ml-3 col-12 text-muted">
                <i>No prods , comming soon</i>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
