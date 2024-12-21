import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Header = ({ isLogin, setIsLogin }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    //서버 요청 없이 로그아웃
    // localStorage.removeItem("isLogin");
    // localStorage.removeItem("jwt_token");
    // localStorage.removeItem("refresh_token");
    // setIsLogin(false);
    // alert("로그아웃되었습니다.");
    // navigate("/");
    try {
      const response = await axios.post("http://your-api-endpoint/logout", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
      });
  
      if (response.data.success) {
        // 성공적인 로그아웃 처리
        localStorage.removeItem("isLogin");
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("refresh_token");
  
        setIsLogin(false);
        alert("로그아웃되었습니다.");
        navigate("/");
      } else {
        // 서버에서 오류 반환
        alert(response.data.message || "로그아웃 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그아웃 요청 실패:", error.response || error.message);
      alert("로그아웃 요청 중 문제가 발생했습니다.");
    }
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
