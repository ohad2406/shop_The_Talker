import { NavLink } from "react-router-dom";
import "../style/navbar.css";
import useSticky from "./common/useSticky";

const Navbar = ({ user }) => {
  const isSticky = useSticky();

  return (
    <nav
      className={
        isSticky
          ? "sticky navbar navbar-expand-xl navbar-light shadow-sm "
          : "navbar navbar-expand-xl navbar-light shadow-sm  "
      }
    >
      
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarsExample03"
        aria-controls="navbarsExample03"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarsExample03">
        <ul className="navbar-nav mr-auto navbar-center">
          {user && (
            <>
              <li className="nav-item">
                <NavLink
                  className="nav-link mt-1"
                  to="/my-fav"
                  data-toggle="collapse"
                  data-target=".navbar-collapse"
                >
                  <i className="fa fa-heart " style={{ fontSize: "1.5em" }}></i>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link mt-1"
                  to="/my-cart"
                  data-toggle="collapse"
                  data-target=".navbar-collapse"
                >
                  <i
                    className="fas fa-shopping-cart"
                    style={{ fontSize: "1.5em" }}
                  ></i>
                </NavLink>
              </li>
            </>
          )}

          <li className="nav-item">
            <NavLink
              className="nav-link mt-1"
              to="/contact"
              data-toggle="collapse"
              data-target=".navbar-collapse"
            >
              <i
                className="far fa-envelope-open"
                style={{ fontSize: "1.5em" }}
              ></i>
            </NavLink>
          </li>
        </ul>

        <ul className="navbar-nav navbar-center ">
          <li className="nav-item">
            <NavLink
              className="nav-link mt-1"
              to="/"
              data-toggle="collapse"
              data-target=".navbar-collapse"
            >
              HOME
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link mt-1"
              to="/man-prod"
              data-toggle="collapse"
              data-target=".navbar-collapse"
            >
              MAN
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link mt-1"
              to="/woman-prod"
              data-toggle="collapse"
              data-target=".navbar-collapse"
            >
              WOMAN
            </NavLink>
          </li>

          {user && user.admin && (
            <>
              <li className="nav-item mt-1" style={{ fontSize: "1em" }}>
                <NavLink
                  className="nav-link"
                  to="/my-prods"
                  data-toggle="collapse"
                  data-target=".navbar-collapse"
                >
                  MY-PROD
                </NavLink>
              </li>
              <li className="nav-item mt-1 " style={{ fontSize: "1em" }}>
                <NavLink
                  className="nav-link"
                  to="/create-prod"
                  data-toggle="collapse"
                  data-target=".navbar-collapse"
                >
                  CREATE-NEW-PROD
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <ul className="navbar-nav ml-auto mr-5">
          {!user && (
            <li className="nav-item ">
              <NavLink
                className="nav-link"
                to="/signin"
                data-toggle="collapse"
                data-target=".navbar-collapse"
              >
                <i className="fas fa-sign-in-alt mr-1"></i>
                LOGIN
              </NavLink>
            </li>
          )}
          {user && (
            <>
              <li className="nav-item" style={{ fontSize: "1em" }}>
                <NavLink
                  to="/logout"
                  className="nav-link"
                  data-toggle="collapse"
                  data-target=".navbar-collapse"
                >
                  <i className="fas fa-sign-out-alt"></i> LOGOUT
                </NavLink>
              </li>

              <li className="nav-item" style={{ fontSize: "1em" }}>
                <NavLink
                  className="nav-link"
                  to="/settings/edit"
                  data-toggle="collapse"
                  data-target=".navbar-collapse"
                >
                  <i className="fas fa-user-cog"></i>
                  SETTING
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
