import "../../style/header.css";
const PageHeader = ({ titleText, subtext }) => {
  return (
    <div className="row">
      <div className="col-12 mt-4 all_the_header">
        <h1 className="text-center">{titleText}</h1>
        <p className="text-center ">{subtext}</p>
      </div>
    </div>
  );
};

export default PageHeader;
