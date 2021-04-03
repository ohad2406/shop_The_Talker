import _ from "lodash";

const SortProd = ({ prods, sortValue }) => {
  const handleSort = (e) => {
    let newProd = prods;
    const { value } = e.target;
    if (value === "cheapest") {
      newProd.sort((a, b) => parseFloat(a.prodPrice) - parseFloat(b.prodPrice));
      sortValue(newProd);
    } else if (value === "expensive") {
      newProd.sort((a, b) => parseFloat(b.prodPrice) - parseFloat(a.prodPrice));
      sortValue(newProd);
    } else {
      newProd = _.orderBy(newProd, "prodName", "asc");
      sortValue(newProd);
    }
  };

  return (
    <div className="form-group">
      <label>Select list:</label>

      <select
        className="ml-2 mt-3 form-select d-block form-control"
        onChange={handleSort}
      >
        <option value="">Default</option>
        <option value="name">by name</option>
        <option value="cheapest">cheap</option>
        <option value="expensive">expensive</option>
      </select>
    </div>
  );
};

export default SortProd;
