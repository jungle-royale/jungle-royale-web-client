import { useLoginContext } from "../contexts/LoginContext";
import useAuthHandlers from "../hooks/useAuthHandlers";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const { isLogin } = useLoginContext();
  const { handleLogin, handleLogout } = useAuthHandlers();
  const navigate = useNavigate();

  const handleMypageClick = () => {
    if (isLogin) {
      navigate("/mypage");
    } else {
      alert("로그인 후 이용해주세요");
      navigate("/login");
    }
  };

  return (
    <header>
      <div className="logo">
        <a href="/">
          <img src="/assets/header_logo.png" alt="Eternal Snowman" />
        </a>        
      </div>
      <nav>
        <a href="/">소식</a>
        <a href="/ranking">랭킹</a>
        {isLogin ? (
          <div>
            <a onClick={handleLogout} className="logout-link">로그아웃</a>
            <a onClick={handleMypageClick}>마이페이지</a>
          </div>
        ) : (
          <div>
            <a onClick={handleLogin} className="login-link">로그인</a>
            <a onClick={handleMypageClick}>마이페이지</a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;