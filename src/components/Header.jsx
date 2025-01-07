import { useLoginContext } from "../contexts/LoginContext";
import useAuthHandlers from "../hooks/useAuthHandlers";
import "./Header.css";
import useSafeNavigation from "../hooks/useSafeNavigation";
// import AudioPlayer from "../utils/AudioPlayer"; // AudioPlayer 컴포넌트 임포트


const Header = () => {
  const { isLogin, userRole } = useLoginContext();
  const { handleLogin, handleLogout } = useAuthHandlers();
  const { navigateSafely } = useSafeNavigation();


  return (

    <header>
      <div className="logo">
        <a href="/" onClick={(e) => navigateSafely(e, "/")}>
          <img src="/assets/headercon.png" alt="Eternal Snowman" />
        </a>        
        {/* <AudioPlayer src="/assets/BackgroundBGM.wav" loop={true} /> */}
      </div>
      <nav>
      {import.meta.env.VITE_SHOW_DEV_PAGE === 'true' && (
      <a href="/test" onClick={(e) => navigateSafely(e, "/test")}>test</a>
      )}
  
      {isLogin && (
        <a href="/store" onClick={(e) => navigateSafely(e, "/store")}>상점</a>
      )}
      {/* <a href="/board" onClick={(e) => navigateSafely(e, "/post")}>소식</a> */}
      <a href="/ranking" onClick={(e) => navigateSafely(e, "/ranking")}>랭킹</a>
        <div className="nav-links">
          {isLogin ? (
            <>
              <a onClick={handleLogout} className="logout-link">로그아웃</a>
              {userRole === "MEMBER" &&(
                <a href="/mypage" onClick={(e) => navigateSafely(e, "/mypage")}>마이페이지</a>
              )}
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