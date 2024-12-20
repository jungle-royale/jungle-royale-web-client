//kakao developers app key -> REST API(e8304b2a6b5aeb5020ef6abeb405115b)
import axios from "axios";
import { useState } from "react";

const  SocialKakao = () => {
  const[ isLogin, setIsLogin ] = useState(false);
  //const Rest_api_key = '9b5e1f47241e82beb559d44bd2a25377';
  const Rest_api_key = 'e8304b2a6b5aeb5020ef6abeb405115b';
  const redirect_uri = "http://localhost:5173/social-kakao"; //돌아올 url
  // oauth 요청 URL -> 카카오 자체 로그인 화면
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
  
  // 인가코드 추출
  console.log("Current URL:", window.location.href);
  const code = new URL(window.location.href).searchParams.get("code");//현재 url 문자열로 변환->인가코드만 추출
  console.log(code);

  // 인가코드를 서버로 전송
  const sendCodeToServer = async (authCode) => {
    try {
      const response = await axios.post("http://192.168.1.241:8080/api/auth/kakao/callback", {
        code: authCode,
      });
      console.log("Server Response:", response.data);
      setIsLogin(true); // 로그인 상태 갱신
      window.history.pushState({}, "", "/");
    } catch (error) {
      console.error("Error sending code to server:", error);
    }
  };

  //code 추출 시 server로 전송
  if (code) {
    sendCodeToServer(code);
  }


  //onclick 시 카카오 로그인으로 이동
  const handleLogin = ()=>{
      window.location.href = kakaoURL
  }

  const handleLogout = ()=>{
    setIsLogin(false);
    alert("Logout!");
}

  return(
    <div>
      <h1>카카오 로그인 화면</h1>
      {isLogin ? (
        <button onClick={handleLogout}>로그아웃</button>
      ) : (
        <button onClick={handleLogin}>카카오 로그인</button>
      )
      }
    </div> 
  )

}

export default SocialKakao;