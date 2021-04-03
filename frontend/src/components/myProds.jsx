import React, { Component } from "react";
import { Link } from "react-router-dom";
import PageHeader from "./common/pageHeader";
import prodService from "../services/prodService";
import Prod from "./common/prod";
import { toast } from "react-toastify";

import SortProd from "./common/SortProd";
class MyProds extends Component {
  state = {
    prods: [],
    errors: {},
    pages: 0,
    arrPage: [],
  };

  componentDidMount() {
    this.setDataFromServer();
  }
  async setDataFromServer() {
    const { arrPage } = this.state;
    const { data } = await prodService.getAllProds(this.state.pages);
    for (let i = 1; i <= data.numOfPages + 1; i++) {
      arrPage.push(i);
    }
    // console.log(data.pages);
    this.setState({ prods: data.data });
  }

  handleSortChange = (prods) => {
    this.setState({ prods });
  };

  handleDelete = async (id) => {
    const { arrPage } = this.state;
    await prodService.deleteProd(id);
    toast.dark("Prod Deleted Succuessfuly");
    arrPage.length = 0;
    this.setDataFromServer();
  };
  handlePage = async ({ num }) => {
    const { data } = await prodService.getAllProds(num - 1);
    this.setState({ prods: data.data });
    window.scrollTo(0, 0);
  };

  render() {
    const { prods, arrPage } = this.state;
    return (
      <div className="container mb-4">
        {this.state.postData}
        <PageHeader titleText="MY-PROD" />{" "}
        <SortProd prods={prods} sortValue={this.handleSortChange} />
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between">
              <Link
                className="btn btn-primary text-white"
                to="/create-prod"
                style={{ fontSize: "1.2em" }}
              >
                create a new prod
              </Link>
            </div>
            {
              <div className="row">
                <>
                  {prods.length > 0 &&
                    prods.map((prod) => (
                      <Prod
                        key={prod._id}
                        prod={prod}
                        onDelete={() => {
                          if (
                            window.confirm("Are you sure you want to delete?")
                          )
                            this.handleDelete(prod._id);
                        }}
                      />
                    ))}
                  {prods.length === 0 && (
                    <p className="ml-3 col-12 text-muted">
                      <i>אין פריטים, צור אחד</i>
                    </p>
                  )}
                </>
              </div>
            }
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
        </div>
      </div>
    );
  }
}

export default MyProds;
