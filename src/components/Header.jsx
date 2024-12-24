import { useLoginContext } from "../contexts/LoginContext";
import useAuthHandlers from "../hooks/useAuthHandlers";
import "./Header.css";

const Header = () => {
  const { isLogin } = useLoginContext();
  const { handleLogin, handleLogout } = useAuthHandlers();

  return (
    <header>
      <div className="logo">
        <img src="/assets/header_logo.png" alt="Eternal Snowman" />
        <h1>Eternal Snowman</h1>
      </div>
      <nav>
        <a href="/">소식</a>
        <a href="/ranking">랭킹</a>
        <a href="/login">로그아웃</a>
        <a href="/mypage">마이페이지</a>
      </nav>
      <div className="user-controls">
        {isLogin ? (
          <button onClick={handleLogout}>로그아웃</button>
        ) : (
          <button onClick={handleLogin}>로그인</button>
        )}
      </div>
    </header>
  );
};

export default Header;