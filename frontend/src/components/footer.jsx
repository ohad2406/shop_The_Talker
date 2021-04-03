const Footer = () => {
  return (
    <p className="border-top pt-3 text-center">
      the talker <i className="fas fa-angle-double-up"></i> collection
      &copy; 2020 - {new Date().getFullYear()}
    </p>
  );
};

export default Footer;
