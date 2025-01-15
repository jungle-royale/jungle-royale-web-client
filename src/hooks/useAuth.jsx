import { loginWithKakao, loginGuest } from "../api";
import log from 'loglevel';
import { useLoginContext } from "../contexts/LoginContext";

export const useAuth = () => {
  const { setIsLogin, setJwtToken, setUserRole } = useLoginContext();

  const loginWithKakaoContext = async (authCode) => {
    try {
      // API 호출
      const data = await loginWithKakao(authCode);

      // Context 업데이트
      setIsLogin(true);
      setJwtToken(data.jwtToken);
      setUserRole(data.role);

      // 로컬 스토리지 업데이트
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("jwt_token", data.jwtToken);
      localStorage.setItem("jwt_refresh", data.jwtRefreshToken);

      return data;
    } catch (error) {
      log.error("카카오 로그인 처리 실패:", error.message);
      throw error;
    }
  };

  const loginGuestContext = async (authCode) => {
    try {
      // API 호출
      const data = await loginGuest(authCode);
      log.info("비회원 로그인 data", data);

      // Context 업데이트
      setIsLogin(true);
      setJwtToken(data.jwtToken);
      setUserRole(data.role);

      // 로컬 스토리지 업데이트
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("jwt_token", data.jwtToken);
      localStorage.setItem("jwt_refresh", data.refreshToken);

      return data;
    } catch (error) {
      log.error("비회원 로그인 처리 실패:", error.message);
      throw error;
    }
  };

  return { loginWithKakaoContext, loginGuestContext };
};
