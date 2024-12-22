import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import useLoginStatus from "../hooks/useLoginStatus";


const Login = () => {
  const Rest_api_key = 'e8304b2a6b5aeb5020ef6abeb405115b';
  const redirect_uri = "http://localhost:5173/login"; // 리다이렉트 URL 설정
  const navigate = useNavigate();
  const [, setIsLogin] = useLoginStatus();


  //const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code&prompt=consent`;  //동의 화면 무조건 뜨게하기기


  const sendCodeToServer = async (authCode) => {
    try {
      console.log("Attempting to send code:", authCode);
      const response = await axios.post(
        "http://192.168.1.241:8080/api/auth/kakao/login",
        { code: authCode },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Server Response:", response.data);

      // 로그인 상태 저장
      localStorage.setItem("isLogin", "true")
      localStorage.setItem("access_token", response.data.accessToken); // 인증 토큰 저장
      localStorage.setItem("refresh_token", response.data.refreshToken); // 리프레시 토큰 저장
      localStorage.setItem("expires_in", response.data.expiresIn)
      localStorage.setItem("isGuest", response.data.isGuest)
      setIsLogin(true); // 상태 즉시 반영

      // 홈 화면으로 리다이렉트
      navigate("/");
    } catch (error) {
      console.error("Error sending code to server:", error.response || error.message);
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