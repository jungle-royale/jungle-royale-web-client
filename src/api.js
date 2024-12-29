import axios from "axios";

//const BASE_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "http://192.168.1.241:8080";   //5G
//const BASE_URL = "http://172.16.175.152:8080";   //olleh 24G
//const BASE_URL = "http://172.16.156.158:8080";    //olleh
//const BASE_URL = "http://172.30.1.34:8080";    //watercooler


//api 생성
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

//토큰 재발급 요청 api
export const refreshAccessToken = async () => {
  try {
    console.log("Access token 갱신 요청 시작"); // 요청 시작 확인
    const response = await apiClient.post("/api/auth/kakao/refresh-token", {}, {
      headers: {
        authorization_refresh: `Bearer ${localStorage.getItem("refresh_token")}`,
      },
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

//카카오 로그인 구현 api
export const loginWithKakao = async (authCode) => {
  try {
    const response = await apiClient.post("/api/auth/kakao/login",
      { code: authCode },
    );
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userRole", response.data.role);
    localStorage.setItem("jwt_token", response.data.jwtToken);
    localStorage.setItem("access_token", response.data.accessToken);
    localStorage.setItem("refresh_token", response.data.refreshToken);
    localStorage.setItem("expires_in", response.data.expiresIn);
    return response.data;
  } catch (error) {
    console.error("Login 실패:", error.message);
    throw error;
  }
};

//비회원 로그인 구현 api
export const loginGuest = async (authCode) => {
  try {
    const response = await apiClient.post("/api/auth/guest/login",
      { code: authCode },
    );
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("jwt_token", response.data.jwtToken);
    return response.data;
  } catch (error) {
    console.error("Login 실패:", error.message);
    throw error;
  }
};

// //로그아웃 구현 api
export const logout = async () => {
  try {
    const response = await apiClient.post("/api/auth/logout",
      { userRole : localStorage.getItem("role")}, 
      { headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,},
    });
    console.log(response);
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

//방 생성 api
export const createRoom = async (roomDetails) => {
  return apiClient.post("/api/rooms/create", roomDetails, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
    },
  });
};

//방 list 생성 api(list + player 객체)
export const fetchRooms = async () => {
  return apiClient.get("/api/rooms/list", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
    },
  });
};

//방 입장 가능 여부 확인 api
export const checkRoomAvailability = async (roomId) => {
  const response = await apiClient.post(`/api/rooms/${roomId}/check`, {}, 
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    }
  );
  return response.data; // 예: { isAvailable: true, message: "방 입장 가능" }
};


//회원 정보 조회 api
export const checkMemberSheet = async (roomId) => {
  console.log(roomId);
  const response = await apiClient.post(`/api/users/profile`, {}, 
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    }
  );
  return response.data;
};

// 게시물 목록 가져오기 api
export const fetchPosts = async () => {
  return apiClient.get("/api/posts/list", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
    },
  });
};

// 게시물 하나 가져오기
export const getPost = async (postId) => {
  return apiClient.get(`/api/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
    },
  });
};

// 게시물 올리기 api
export const createPost = async (formData) => {
  try {
    const response = await apiClient.post(`/api/posts/create`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        "Content-Type": "multipart/form-data" 
      },
    });
    return response.data; // 성공한 데이터를 반환
  } catch (error) {
    console.error("게시물 생성 중 오류:", error);
    throw error; // 에러를 호출한 곳으로 전달
  }
};