import { Link, useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const Header = ({ isLogin, setIsLogin, loggedIn,setLoggedIn }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    if (!isLogin) {
      setIsLogin(true);
    }
  };

  const handleSignupClick = () => {
    if (isLogin) {
      setIsLogin(false);
    }
  };
  const magic=()=>{
    setIsLogin(false)
    setLoggedIn(true)
  }

  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap"></use></svg>
          </a>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><a href="#" className="nav-link px-2 text-secondary">Home</a></li>
            <li><a href="#" className="nav-link px-2 text-white">Features</a></li>
            <li><a href="#" className="nav-link px-2 text-white">About</a></li>
          </ul>

          

          <div className="text-end">
            {loggedIn ? (
              <>
                <Link to="/login" onClick={handleLoginClick} className="btn btn-outline-light me-2">Login</Link>
                <Link to="/signup" type="button" onClick={handleSignupClick} className="btn btn-warning">Sign-up</Link>
              </>
            ) : (
              <button className="btn btn-outline-light me-2" onClick={magic}>Log out</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
