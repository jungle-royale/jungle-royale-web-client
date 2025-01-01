//로그아웃 처리
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../contexts/LoginContext";
import { logout } from "../api";
import { useClickLock } from '../contexts/ClickLockContext';

function useAuthHandlers() {
  const { setIsLogin } = useLoginContext();
  const navigate = useNavigate();
  const { isLocked, lock, unlock } = useClickLock();

  const handleLogin = () => {
    if(isLocked) return;
    lock();
    navigate("/login");
    unlock();
  };

  const handleLogout = async () => {
    if(isLocked) return;
    lock();
    try {
      await logout();
      setIsLogin(false);
      alert("로그아웃되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 요청 실패:", error.message);
      alert("로그아웃 요청 중 문제가 발생했습니다.");
    } finally {
      unlock();
    }
  };


  return { handleLogin, handleLogout };
}

export default useAuthHandlers;