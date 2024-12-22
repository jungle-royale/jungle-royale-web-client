import PropTypes from "prop-types";
//import axios from "axios";  //서버 로그아웃 구현 시 잠금 해제
import Button from "./Button";
import useAuthHandlers from "../hooks/useAuthHandlers";

const Header = ({ isLogin, setIsLogin }) => {
  const {handleLogin, handleLogout} = useAuthHandlers(setIsLogin);
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