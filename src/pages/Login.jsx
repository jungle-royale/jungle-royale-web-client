import { loginWithKakao } from "../api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useLoginContext } from "../contexts/LoginContext";
import { useClickLock } from '../contexts/ClickLockContext';



const Login = () => {
  const { isLocked, lock, unlock } = useClickLock();

  const Rest_api_key = 'e8304b2a6b5aeb5020ef6abeb405115b';
  const redirect_uri = "http://localhost:5173/login"; // 리다이렉트 URL 설정
  const navigate = useNavigate();
  const { setIsLogin, setUserRole } = useLoginContext();


  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;



  const sendCodeToServer = async (authCode) => {
    if (isLocked) return; // 중복 클릭 방지
    lock();

    try {
      const response = await loginWithKakao(authCode); // 반환된 데이터 처리
      setIsLogin(true); // 로그인 상태 업데이트
      setUserRole(response.role);
      console.log("카카오 Login 성공:", response);
      alert("카카오 로그인 성공");
      navigate("/"); // 홈으로 이동
    } catch (error) {
      console.error("Login 처리 중 오류 발생:", error.message);
    } finally{
      unlock();
    }
  };

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    console.log("Authorization Code:", code);
    if (code) {
      sendCodeToServer(code);
    }
  }, []);

  const handleLoginKakao = () => {
    if (isLocked) return; // 중복 클릭 방지
    lock();
    window.location.href = kakaoURL;
    unlock();
  };

  return (
    <div>
      <h1>로그인 화면</h1>
      <Button text="카카오 로그인" onClick={handleLoginKakao} />
    </div>
  );
};

export default Login;