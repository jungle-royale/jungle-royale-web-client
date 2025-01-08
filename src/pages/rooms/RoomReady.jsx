import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLoginContext } from "../../contexts/LoginContext";
import { joinRoomAvailability } from "../../api"; // 방 입장 가능 여부 API

const RoomReady = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const { isLogin, jwtToken } = useLoginContext(); // 로그인 상태 확인
  const navigate = useNavigate();


  // API 자동 호출
  useEffect(() => {
    const checkRoomAvailability = async () => {
      try {
        // 방 입장 가능 여부 확인
        const response = await joinRoomAvailability(roomId);
        if (response) {
          // 방 입장이 가능하면 게임 URL로 리다이렉트
          window.history.pushState({ from: "RoomReady" }, "", "/room"); // RoomList URL로 히스토리 추가
          const gameUrl = `http://game.eternalsnowman.com/room?roomId=${response.roomId}&clientId=${response.clientId}`;
          window.location.href = gameUrl; // 브라우저에서 외부 URL로 이동
        } else {
          alert(response.message || "방 입장이 불가능합니다.");
          if (isLogin && jwtToken) {
            navigate("/room"); // 방 목록으로 리다이렉트
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        alert(error.response?.data?.message || "방 입장 여부를 확인할 수 없습니다. 다시 시도해주세요.");
        if (isLogin && jwtToken) {
          navigate("/room"); // 방 목록으로 리다이렉트
        } else {
          navigate("/");
        }
      }
    };

    if (roomId) {
      checkRoomAvailability(); // roomId가 존재할 경우만 API 호출
    }
  }, [roomId, navigate, isLogin, jwtToken]);

  return (
    <div>
      <h1>대기 페이지</h1>
      <p>{roomId}번 방 입장 여부를 확인 중입니다...</p>
    </div>
  );
};

export default RoomReady;
