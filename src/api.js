import axios from "axios";

const BASE_URL = "http://192.168.1.241:8080/api";   //5G
//const BASE_URL = "http://172.16.156.158:8080/api";    //olleh


const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const refreshAccessToken = async () => {
  try {
    console.log("Access token 갱신 요청 시작"); // 요청 시작 확인
    const response = await apiClient.post("/auth/kakao/refresh-token", {}, {
      headers: {
        authorization_refresh: `Bearer ${localStorage.getItem("refresh_token")}`,
      },
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

export const loginWithKakao = async (authCode) => {
  try {
    const response = await apiClient.post("/auth/kakao/login",
      { code: authCode },
      { headers: { "Content-Type": "application/json" } }
    );
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("jwt_token", response.data.jwtToken);
    localStorage.setItem("access_token", response.data.accessToken);
    localStorage.setItem("refresh_token", response.data.refreshToken);
    localStorage.setItem("expires_in", response.data.expiresIn);
    localStorage.setItem("role", response.data.role);
    return response.data;
  } catch (error) {
    console.error("Login 실패:", error.message);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post("/auth/logout", {}, {
      headers: {
        authorization_access: `Bearer ${localStorage.getItem("access_token")}`,
        authorization_refresh: `Bearer ${localStorage.getItem("refresh_token")}`,
      },
    });
    if (response.data.success) {
      localStorage.clear();
      console.log("로그아웃 성공");
    } else {
      console.error("로그아웃 실패:", response.data.message);
    }
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error.message);
  }
};
