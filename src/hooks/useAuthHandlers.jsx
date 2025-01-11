import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useClickLock } from '../contexts/ClickLockContext';
import log from 'loglevel';
import { logout } from "../api";

function useAuthHandlers() {
  const navigate = useNavigate();
  const { loginGuestContext } = useAuth();
  const { isLocked, lock, unlock } = useClickLock();

  const handleLoginKakao = async () => {
    if (isLocked) return;
    lock();
    try {
      const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URL}&response_type=code`;
      window.location.href = kakaoURL;
    } finally {
      unlock();
    }
  };

  const handleLoginGuest = async () => {
    if (isLocked) return;
    lock();
    try {
      await loginGuestContext();
      navigate("/room");
    } catch (error) {
      log.error("비회원 로그인 실패:", error.message);
    } finally {
      unlock();
    }
  };

  const handleLogout = async () => {
    if (isLocked) return;
    lock();
    try {
      await logout();
      localStorage.clear(); // 로컬 스토리지 초기화
      navigate("/"); // 로그아웃 후 메인 화면으로 이동
      alert("로그아웃되었습니다.");
    } catch (error) {
      log.error("로그아웃 실패:", error.message);
      alert("로그아웃 중 문제가 발생했습니다.");
    } finally {
      unlock();
    }
  };

  return { handleLoginKakao, handleLoginGuest, handleLogout, navigate };
}

export default useAuthHandlers;
