//useTokenRefresh에서 실행될 함수
import axios from "axios";

const refreshAccessToken = async () => {
  try {
    console.log("Access token 갱신 요청 시작"); // 요청 시작 확인

    const response = await axios.post(
      "http://192.168.1.241:8080/api/auth/kakao/refresh-token",
      {}, {
        headers: { authorization_refresh: `Bearer ${localStorage.getItem("refresh_token")}` },
        "Content-Type": "application/json",
      }
    );
    if (response.data.success) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("expires_in", response.data.expires_in);
      console.log("Access 토큰 갱신 완료");
    } else {
      console.error("Access 토큰 갱신 실패:", response.data.message);
    }
  } catch (error) {
    console.error("Access 토큰 갱신 중 오류 발생:", error.message);
  }
};

export default refreshAccessToken;