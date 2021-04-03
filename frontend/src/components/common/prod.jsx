import React from "react";
import { Link } from "react-router-dom";

const Prod = ({
  prod: {
    _id,
    prodPrice,
    prodDescription,
    prodImage,
    prodName,
    prodStock,
    prodCat,
  },
  onDelete,
}) => {
  return (
    <div className="col-md-6 col-sm-12 col-lg-4 col-xl-3 mt-3 mb-3">
      <img className="p-2" src={prodImage} height="300px" width="210px" alt={prodName} />
      <div className="card-body">
        <h5 className="card-title">{prodName}</h5>
        <p className="card-text">{prodDescription}</p>
        <p className="card-text border-top pt-2 mb-1">
          PRICE : {prodPrice} NIS
        </p>

        {prodStock > 0 && <p className="text-success mb-1"> In stock</p>}
        {prodStock == 0 && <p className="text-danger mb-1"> Out of stock </p>}

        <p className="mb-3">GENDER : {prodCat}</p>
        <Link
          className="text-white btn btn-secondary"
          to={`/my-prods/edit/${_id}`}
        >
          EDIT
        </Link>
        <button className="text-white btn btn-danger ml-1" onClick={onDelete}>
          DELETE
        </button>
      </div>
    </div>
  );
};

export default Prod;
