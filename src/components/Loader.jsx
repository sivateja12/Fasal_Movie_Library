const Loader = () => {
  return (
    <div className="text-center">
      <div className="spinner-border" style={{width:"4rem",height:"4rem",marginTop:"6rem" }} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
export default Loader;
