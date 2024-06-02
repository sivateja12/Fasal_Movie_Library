import { Link, useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const Header = ({ isLogin, setIsLogin, loggedIn, setLoggedIn }) => {
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

  const handleLogout = () => {
    setIsLogin(true);
    setLoggedIn(false);
    navigate('/login');
  };

  return (
    <header className="p-3 text-bg-dark">
      <div className="container">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
            <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap"></use></svg>
          </Link>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><Link to="/search" className="nav-link px-2 text-secondary">Home</Link></li>
            <li><Link to="/public-playlist" className="nav-link px-2 text-white">Public Playlist</Link></li>
            <li><Link to="/private-playlist" className="nav-link px-2 text-white">Private Playlist</Link></li>
          </ul>

          <div className="text-end">
            {loggedIn ? (
              <button className="btn btn-outline-light me-2" onClick={handleLogout}>Log out</button>
            ) : (
              <>
                <Link to="/login" onClick={handleLoginClick} className="btn btn-outline-light me-2">Login</Link>
                <Link to="/signup" onClick={handleSignupClick} className="btn btn-warning">Sign-up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
