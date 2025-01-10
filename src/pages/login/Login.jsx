import { useClickLock } from '../../contexts/ClickLockContext';
import { useNavigate } from "react-router-dom";
import log from "loglevel";
import { loginGuest } from "../../api.js";

const Login = () => {
  const { isLocked, lock, unlock } = useClickLock();
  const navigate = useNavigate();

  const Rest_api_key = 'e8304b2a6b5aeb5020ef6abeb405115b';
  const redirect_uri = `${import.meta.env.VITE_KAKAO_REDIRECT_URL}`;

  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  const handleLoginKakao = () => {
    if (isLocked) return; // 중복 클릭 방지
    lock();
    window.location.href = kakaoURL; // 리다이렉트
  };

  const handleLoginGuest = async () => {
    if (isLocked) return;
    lock();
    try {
      const response = await loginGuest();
      log.info("비회원 Login 성공:", response);
      alert("비회원으로 로그인되었습니다.");
      navigate("/room");
    } catch (error) {
      console.error("비회원 로그인 처리 중 오류 발생:", error.message);
      alert("비회원 로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      unlock();
    }
  };

  return (
    <div
      className="bg-cover bg-center bg-fixed min-h-screen"
      style={{
        backgroundImage: `url(/assets/background.png)`,
      }}
    >
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-md text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">로그인 화면</h1>
          <img
            src="/assets/kakaologinwide.png"
            className="cursor-pointer w-full max-w-xs mx-auto"
            alt="카카오 로그인 버튼"
            onClick={handleLoginKakao}
          />
          <button
            onClick={handleLoginGuest}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            비회원 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
