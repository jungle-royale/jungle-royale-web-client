import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useSafeNavigation from "../../hooks/useSafeNavigation";
import { joinRoomAvailability } from "../../api"; // 방 입장 가능 여부 API

const RoomReady = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const {navigateSafely} = useSafeNavigation();

  useEffect(() => {
    const checkRoomAvailability = async () => {
      try {
        // 방 입장 가능 여부 확인
        const response = await joinRoomAvailability(roomId);
        if (response.isAvailable) {
          // 방 입장이 가능하면 게임 URL로 리다이렉트
          const gameUrl = `http://game.eternalsnowman.com/rooms?roomId=${response.roomId}&clientId=${response.clientId}`;
          window.location.href = gameUrl; // 브라우저에서 외부 URL로 이동
        } else {
          alert(response.message || "방 입장이 불가능합니다.");
          navigateSafely("/rooms"); // 방 목록으로 리다이렉트
        }
      } catch (error) {
        console.error("방 입장 확인 중 오류 발생:", error);
        alert("방 입장 여부를 확인할 수 없습니다. 다시 시도해주세요.");
        navigateSafely("/rooms"); // 오류 발생 시 방 목록으로 리다이렉트
      }
    };

    if (roomId) {
      checkRoomAvailability(); // roomId가 존재할 경우만 API 호출
    }
  }, [roomId, navigateSafely]);


  return (
    <div>
      <h1>대기 페이지</h1>
      <p>{roomId}번 방 입장 여부를 확인 중입니다...</p>
    </div>
  );
};

export default RoomReady;
