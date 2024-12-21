import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Header = ({ isLogin, setIsLogin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    setIsLogin(false);
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header>
      <h1>Jungle Royal</h1>
      {isLogin ? (
        <Button text="Logout" type="secondary" onClick={handleLogout} />
      ) : (
        <Button text="Login" type="primary" onClick={handleLogin} />
      )}
    </header>
  );
};

Header.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  setIsLogin: PropTypes.func.isRequired,
};

export default Header;
