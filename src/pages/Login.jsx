import { loginWithKakao, loginGuest } from "../api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useLoginContext } from "../contexts/LoginContext";

const Login = () => {
  const Rest_api_key = 'e8304b2a6b5aeb5020ef6abeb405115b';
  const redirect_uri = "http://localhost:5173/login"; // 리다이렉트 URL 설정
  const navigate = useNavigate();
  const { setIsLogin } = useLoginContext();


  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;



  const sendCodeToServer = async (authCode) => {
    try {
      const response = await loginWithKakao(authCode); // 반환된 데이터 처리
      setIsLogin(true); // 로그인 상태 업데이트
      console.log("카카오 Login 성공:", response);
      alert("카카오 로그인 성공");
      navigate("/"); // 홈으로 이동
    } catch (error) {
      console.error("Login 처리 중 오류 발생:", error.message);
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
    window.location.href = kakaoURL;
  };

  //비회원 로그인 시
  const handleLoginGuest = async () => {
    try {
      const response = await loginGuest(); // 서버와 통신하여 토큰 수신
      setIsLogin(true); // 로그인 상태 업데이트
      console.log("비회원 Login 성공:", response);
      alert("비회원으로 로그인되었습니다.");
      navigate("/"); // 홈 화면으로 이동
    } catch (error) {
      console.error("비회원 로그인 처리 중 오류 발생:", error.message);
      alert("비회원 로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <h1>로그인 화면</h1>
      <Button text="카카오 로그인" onClick={handleLoginKakao} />
      <Button text="비회원 로그인" onClick={handleLoginGuest} />

    </div>
  );
};

export default Login;