import { useLoginContext } from "../contexts/LoginContext";
import useAuthHandlers from "../hooks/useAuthHandlers";
import "./Header.css";

const Header = () => {
  const { isLogin } = useLoginContext();
  const { handleLogin, handleLogout } = useAuthHandlers();

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
          <a onClick={handleLogout} className="logout-link">로그아웃</a>
        ) : (
          <a onClick={handleLogin} className="login-link">로그인</a>
        )}
        <a href="/mypage">마이페이지</a>
      </nav>
      
    </header>
  );
};

export default Header;