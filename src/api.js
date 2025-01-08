import apiClient from "./axiosClient";
import log from 'loglevel';


//카카오 로그인 구현 api
export const loginWithKakao = async (authCode) => {
  try {
    const response = await apiClient.post("/api/auth/kakao/login",
      { code: authCode },
    );
    if(response.data && response.data.jwtToken && response.data.refreshToken){
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("jwt_token", response.data.jwtToken);
      localStorage.setItem("jwt_refresh", response.data.refreshToken);
    }else{
      console.error("토큰 정보가 누락되었습니다.");
      throw new Error("Incomplete token response");
    }
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
    localStorage.setItem("jwt_refresh", response.data.refreshToken);
    log.info(response);
    // if(response.data && response.data.jwtToken && response.data.refreshToken){
    // } else {
    //   console.error("토큰 정보가 누락되었습니다.");
    //   throw new Error("Incomplete token response");
    // }
    return response.data;
  } catch (error) {
    console.error("Login 실패:", error.message);
    throw error;
  }
};

//로그아웃 구현 api
export const logout = async () => {
  try {
    const response = await apiClient.post("/api/auth/logout",
      { refreshToken : localStorage.getItem("jwt_refresh")}, 
      );
    log.info(response);
    if (response.data.success) {
      localStorage.clear();
      log.info("로그아웃 성공");
    } else {
      console.error("로그아웃 실패:", response.data.message);
    }
  } catch (error) {
    console.error("로그아웃 중 오류 발생:", error.message);
  }
};

//방 생성 api
export const createRoom = async (roomDetails) => {
  return apiClient.post("/api/rooms/create", roomDetails);
};

//방 list 생성 api(list + player 객체)
// export const fetchRooms = async () => {
//   return apiClient.get("/api/rooms/list");
// };
export const fetchRooms = async () => {
  // 서버가 없을 때 임의의 데이터 반환
  const dummyRooms = Array.from({ length: 10 }, (_, index) => ({
    id: `room-${index + 1}`,
    title: `Dummy Room ${index + 1}`,
    minPlayers: Math.floor(Math.random() * 5) + 1, // 최소 1 ~ 최대 5
    maxPlayers: Math.floor(Math.random() * 10) + 6, // 최소 6 ~ 최대 15
    status: index % 2 === 0 ? "WAITING" : "PLAYING", // 대기 중 또는 플레이 중
  }));

  return {
    data: {
      gameRooms: dummyRooms,
      userInfo: { username: "TestUser" }, // 임의 사용자 정보
    },
  };
};


//방 입장 가능 여부 확인 api
export const joinRoomAvailability = async (roomId) => {
  const response = await apiClient.post(`/api/rooms/${roomId}/join`, {});
  return response.data; 
};

//방 돌아가기 api
export const returnRoom = async () => {
  const response = await apiClient.post(`/api/game/return`, {});
  return response.data; 
};

//마이 페이지 불러오기 api
export const fetchMyPage = () => {
  return apiClient.get(`/api/users/mypage`);
};

//마이 페이지 수정 api
export const myPageEdit = async (username) => {
  try {
    const response = await apiClient.put(`/api/users/mypage`,username);
    return response.data;
  } catch (error) {
    console.error("닉네임 수정 중 오류:", error);
    throw error; // 호출한 곳에서 에러 처리
  }
};

// 게시물 목록 가져오기 api
export const fetchPosts = async ({ page = 1, limit = 10 }) => {
  return apiClient.get("/api/posts/list", {
    params: { page, limit },
    skipAuth: true, // 인터셉터에서 인증 건너뛰기
  });
};

// 게시물 하나 가져오기 api
export const getPost = async (postId) => {
  return apiClient.get(`/api/posts/${postId}`, {
    skipAuth: true, // 인터셉터에서 인증 건너뛰기
  });
};

// 게시물 올리기 api
export const createPost = async (formData) => {
  try {
    const response = await apiClient.post(`/api/posts/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });
    return response.data; // 성공한 데이터를 반환
  } catch (error) {
    console.error("게시물 생성 중 오류:", error);
    throw error; 
  }
};

//게시글 삭제 api
export const deletePost = async (postId) => {
  try {
    const response = await apiClient.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("게시물 삭제 중 오류:", error);
    throw error; // 호출한 곳에서 에러 처리
  }
};

//게시글 수정 api
export const updatePost = async (postId, updatedData) => {
  try {
    const response = await apiClient.put(`/api/posts/${postId}`,updatedData,{
      headers: {
        "Content-Type": "multipart/form-data" 
      },
    });
    return response.data;
  } catch (error) {
    console.error("게시물 수정 중 오류:", error);
    throw error; // 호출한 곳에서 에러 처리
  }
};

//상점 전체 정보 불러오기 api
export const fetchStoreData = async () => {
  try {
    const response = await apiClient.get("/api/shops/items");
    return response.data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error.response?.data || error.message);
    throw error;
  }
};

//상점 아이템 구매 api
export const purchaseItem = async (itemCode) => {
  try {
    const response = await apiClient.post(`/api/shops/purchase?itemCode=${itemCode}`, {});
    log.info("Response: ", response)
    return response.data;
  } catch (error) {
    console.error("아이템 구매 중 오류 발생:", error.response?.data || error.message);
    throw error;
  }
};
