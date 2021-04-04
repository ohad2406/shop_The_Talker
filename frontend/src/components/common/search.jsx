import { Component } from "react";
import "../../style/search.css";

class Search extends Component {
  state = {
    value: "",
  };

  handleChange = (e) => {
    this.setState({ value: e.target.value });
  };

  /// this function handle the value and send to parint the value form state
  handleSearch = () => {
    const { searchValue } = this.props;
    const { value } = this.state;
    searchValue(value.trim());
  };

handleOnKeyUp = (event) => {
    if (event.key === "Enter") {
      const { value } = this.state;
      const { searchValue } = this.props;
      searchValue(value.trim());
    }
  };

  render() {
    const { value } = this.state;
    return (
      <div
        className="contaernOfSearch"
        style={{ margin: "70px auto", marginBottom: "0px" }}
        dir="rtl"
      >
        <button onClick={this.handleSearch}>&#x2315;|</button>
        <input type="search" value={value} onChange={this.handleChange} onKeyPress={this.handleOnKeyUp}
/>
      </div>
    );
  }
}

export default Search;
