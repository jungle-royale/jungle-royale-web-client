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
export const fetchRooms = async () => {
  return apiClient.get("/api/rooms/list");
};
// 방 목록 가져오기 (임시 데이터 사용)
// export const fetchRooms = async () => {
  // 임시 데이터 생성
//   const totalRooms = 15; // 총 방 개수
//   const dummyRooms = Array.from({ length: totalRooms }, (_, index) => ({
//     id: index + 1,
//     title: `임시 방 ${index + 1}`,
//     minPlayers: 2, // 최소 플레이어 수
//     maxPlayers: 10, // 최대 플레이어 수
//     currentPlayers: Math.floor(Math.random() * 10), // 현재 플레이어 수 (0 ~ 9)
//     status: index % 2 === 0 ? "playing" : "WAITING", // 방 상태 (게임 중 or 대기 중)
//     createdAt: new Date().toISOString(), // 생성 시간
//   }));

//   // 들어갈 수 있는 방의 상태를 "waiting"으로 설정하고 currentPlayers가 minPlayers보다 적은 방으로 필터링
//   const updatedRooms = dummyRooms.map((room) => ({
//     ...room,
//     status: room.currentPlayers < room.minPlayers ? "waiting" : room.status,
//   }));

//   const dummyUserInfo = {
//     username: "테스트유저", // 사용자 이름
//   };

//   // 임시 데이터 반환
//   return {
//     data: {
//       gameRooms: updatedRooms,
//       userInfo: dummyUserInfo,
//     },
//   };
// };



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
// 게시물 목록 가져오기 (임시 데이터 사용)
// export const fetchPosts = async ({ page = 1, limit = 10 }) => {
  // 임시 데이터 생성
//   const totalPosts = 15; // 총 게시물 수
//   const dummyPosts = Array.from({ length: totalPosts }, (_, index) => ({
//     id: index + 1,
//     title: `임시 게시물 ${index + 1}`,
//     username: `사용자${index + 1}`,
//     createdAt: new Date().toISOString(),
//   }));

//   // 페이지네이션 로직
//   const startIndex = (page - 1) * limit;
//   const endIndex = startIndex + limit;
//   const paginatedPosts = dummyPosts.slice(startIndex, endIndex);

//   // 임시 데이터 반환
//   return {
//     data: {
//       data: paginatedPosts,
//       total: totalPosts,
//     },
//   };
// };


// 게시물 하나 가져오기 api
export const getPost = async (postId) => {
  return apiClient.get(`/api/posts/${postId}`, {
    // skipAuth: true, // 인터셉터에서 인증 건너뛰기
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
