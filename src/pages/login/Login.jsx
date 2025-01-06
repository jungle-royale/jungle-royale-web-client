import { useClickLock } from '../../contexts/ClickLockContext';
import "./Login.css";

const Login = () => {
  const { isLocked, lock } = useClickLock();

  const Rest_api_key = 'e8304b2a6b5aeb5020ef6abeb405115b';
  const redirect_uri = `${import.meta.env.VITE_KAKAO_REDIRECT_URL}`;

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleLoginKakao = () => {
    if (isLocked) return; // 중복 클릭 방지
    lock();
    window.location.href = kakaoURL; // 리다이렉트
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>로그인 화면</h1>
        <img
          src="/assets/kakaologinwide.png"
          className="kakao-button"
          alt="카카오 로그인 버튼"
          onClick={handleLoginKakao}
        />
      </div>
    </div>
  );
};

export default Login;
