import {  Route, Switch } from "react-router-dom";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import Home from "./components/home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "pretty-checkbox/dist/pretty-checkbox.min.css";
import SignIn from "./components/signin";
import { Component } from "react";
import userService from "./services/userService";
import logout from "./components/logout";
import CreateProd from "./components/createProd";
import ProtectedRoute from "./components/common/protectedRoute";
import MyProds from "./components/myProds";
import EditProd from "./components/editProd";
import AccSettings from "./components/accSettings";
import PassowrdChange from "./components/passwordChange";
import ManProd from "./components/manProd";
import WomanProd from "./components/womanProd";
import Logo from "./components/common/logo";
import Contact from "./components/contact";
import DetailsProd from "./components/detailsProd";
import FavoriteCards from "./components/favorite";
import MyCart from "./components/myCart";
import SignUp from "./components/signup";

class App extends Component {
  state = {
    user: null,
    userInfo: null,
  };

  async componentDidMount() {
    const user = userService.getCurrentUser();
    if (!user) {
      return null;
    }
    const userInfo = await userService.getUserInfo();
    this.setState({ user, userInfo });

    const EXPIRE_TIME = 1000 * 60 * 60 * 24 * 7;
    let userData = JSON.parse(localStorage.getItem("expireTime")) || {};
    let diff = new Date() - new Date(userData.time || new Date());
    let timeout = Math.max(EXPIRE_TIME - diff, 0);

    setTimeout(function () {
      localStorage.removeItem("token");
      localStorage.removeItem("expireTime");
      window.location = "/";
      alert("token expired, try to login again");
    }, timeout);
  }

  render() {
    const { user } = this.state;
    return (
      <div className="d-flex flex-column min-vh-100">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="foo"
          style={{ width: "400px" }}/>
        <header>
          <div
            className="container-fluid bg-dark text-center text-white"
            style={{ fontSize: "13px" }}>
            Let's see our good products at cheap prices
          </div>
          <div style={{ backgroundColor: "#FCFCFC" }}>
              <Logo></Logo>
          </div>
          <Navbar user={user} />
        </header>
        <main className="flex-fill container-fluid">
          <Switch>
            <ProtectedRoute
              path="/settings/edit/passChange"
              component={PassowrdChange}/>
            <ProtectedRoute path="/settings/edit" component={AccSettings} />
            <ProtectedRoute
              path="/my-prods/edit/:id"
              component={EditProd}
              admin={true}/>
            <ProtectedRoute path="/detail-prod/:id" component={DetailsProd} />
            <ProtectedRoute path="/my-fav" component={FavoriteCards} />
            <ProtectedRoute path="/my-cart" component={MyCart} />
            <ProtectedRoute
              path="/create-prod"
              component={CreateProd}
              admin={true}/>
            <ProtectedRoute path="/my-prods" component={MyProds} admin={true} />
            <Route path="/man-prod" component={ManProd} />
            <Route path="/woman-prod" component={WomanProd} />
            <Route path="/signin" component={SignIn} />
            <Route path="/logout" component={logout} />
            <Route path="/signup" component={SignUp} />
            <Route path="/contact" component={Contact} />
            <Route path="/" component={Home} exact />
          </Switch>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }
}

export default App;
