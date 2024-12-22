//useTokenRefresh에서 실행될 함수
import axios from "axios";

const refreshJWT = async () => {
  try {
    console.log("jwt token 갱신 요청 시작"); // 요청 시작 확인

    const response = await axios.post(
      "http://192.168.1.241:8080/api/auth/kakao/refresh-token",
      {}, {
        headers: { authorization_refresh: `Bearer ${localStorage.getItem("jwt_token")}` },
        "Content-Type": "application/json",
      }
    );
    if (response.data.success) {
      localStorage.setItem("jwt_token", response.data.jwt_token);
      console.log("jwt 토큰 갱신 완료");
    } else {
      console.error("jwt 토큰 갱신 실패:", response.data.message);
    }
  } catch (error) {
    console.error("jwt 토큰 갱신 중 오류 발생:", error.message);
  }
};

export default refreshJWT;