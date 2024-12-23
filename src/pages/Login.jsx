//import axios from "axios";
import { loginWithKakao } from "../api";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useLoginContext } from "../contexts/LoginContext";

const Login = () => {
  const Rest_api_key = 'e8304b2a6b5aeb5020ef6abeb405115b';
  const redirect_uri = "http://localhost:5173/login"; // 리다이렉트 URL 설정
  const navigate = useNavigate();
  const { setIsLogin } = useLoginContext();


  //const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&prompt=consent`;  //동의 화면 무조건 뜨게하기기


  const sendCodeToServer = async (authCode) => {
    try {
      const response = await loginWithKakao(authCode); // 반환된 데이터 처리
      setIsLogin(true); // 로그인 상태 업데이트
      console.log("Login 성공:", response);
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
  // const handleLogin = () =>{};

  return (
    <div>
      <h1>로그인 화면</h1>
      <Button text="카카오 로그인" onClick={handleLoginKakao} />
      {/* <Button text="비회원 로그인" onClick={handleLogin} /> */}

    </div>
  );
};

export default Login;