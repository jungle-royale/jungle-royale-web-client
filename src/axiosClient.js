import axios from "axios";
import log from "loglevel";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}`;

//api 생성
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

//토큰 재발급 요청 api
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("jwt_refresh");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await axios.post(
    `${BASE_URL}/api/auth/refresh`,
    {},
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  // 새로운 토큰 저장
  localStorage.setItem("jwt_token", response.data.jwtToken);
  localStorage.setItem("jwt_refresh", response.data.refreshToken);

  return response.data.jwtToken;
};

// 요청 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    // config.skipAuth가 true인 경우 Authorization 헤더 추가하지 않음
    if (!config.skipAuth) {
      const token = localStorage.getItem("jwt_token");
      
      // ReturnRoom 요청에 대한 로그 추가
      if (config.isReturnRoom) {
        log.info("Return api 요청 시 token 확인", token);
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response, // 성공 응답은 그대로 반환
  async (error) => {
    const originalRequest = error.config;
    // 만료 토큰 오류 처리
    if (error.response?.data.errorCode === "EXPIRED_TOKEN" && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지
      try {
        const newToken = await refreshAccessToken(); // 토큰 갱신
        originalRequest.headers.Authorization = `Bearer ${newToken}`; // 갱신된 토큰으로 재요청
        return apiClient(originalRequest);
      } catch (refreshError) {
        log.error("토큰 갱신 실패:", refreshError.message);
        localStorage.clear(); // 로컬 스토리지 초기화
        // alert("재로그인이 필요합니다.");
        window.location.href = "/login"; // 로그인 페이지로 리다이렉트
        return Promise.reject(refreshError); // 최종 실패 반환
      }
    }
    // 다른 오류는 그대로 반환
    return Promise.reject(error);
  }
);

export default apiClient;