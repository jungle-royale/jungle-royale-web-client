import { useLoginContext } from "../contexts/LoginContext";
import useAuthHandlers from "../hooks/useAuthHandlers";
import "./Header.css";
import useSafeNavigation from "../hooks/useSafeNavigation";

const Header = () => {
  const { isLogin } = useLoginContext();
  const { handleLogin, handleLogout } = useAuthHandlers();
  const { navigateSafely } = useSafeNavigation();

  return (
    <header>
      <div className="logo">
        <a href="/">
          <img src="/assets/header_logo.png" alt="Eternal Snowman" />
        </a>        
      </div>
      <nav>
      <a href="/notice" onClick={(e) => navigateSafely(e, "/notice")}>소식</a>
      <a href="/ranking" onClick={(e) => navigateSafely(e, "/ranking")}>랭킹</a>
        <div className="nav-links">
          {isLogin ? (
            <>
              <a onClick={handleLogout} className="logout-link">로그아웃</a>
              <a href="/mypage" onClick={(e) => navigateSafely(e, "/mypage")}>마이페이지</a>
              </>
            ) : (
            <>
              <a onClick={handleLogin} className="login-link">로그인</a>
            </>
          )}
        </div>    
      </nav>
    </header>
  );
};

export default Header;