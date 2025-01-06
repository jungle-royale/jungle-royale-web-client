import { useEffect } from "react";
import { useClickLock } from '../contexts/ClickLockContext';
import { useLoginContext } from "../contexts/LoginContext";
import { loginWithKakao } from "../api";


const SendAuthCode = () => {
  const { isLocked, lock, unlock } = useClickLock();
  const { setIsLogin, setUserRole } = useLoginContext();
  
  const sendCodeToServer = async (authCode) => {
    if (isLocked) return; // 중복 클릭 방지
    lock();
    try {
      const response = await loginWithKakao(authCode); // 서버와 통신
      setIsLogin(true); // 로그인 상태 업데이트
      setUserRole(response.role);
    } catch (error) {
      console.error("서버 응답:", error.response?.data || error.message);
    } finally {
      unlock();
    }
  };
  
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    console.log("Authorization Code:", code);
    if (code) {
      sendCodeToServer(code).finally(() => {
        // URL에서 code 제거
        window.history.replaceState({}, document.title, url.pathname);
      });
    }
  }, []);

}

export default SendAuthCode;