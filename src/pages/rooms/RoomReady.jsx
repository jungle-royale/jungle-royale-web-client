import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLoginContext } from "../../contexts/LoginContext";
import { joinRoomAvailability } from "../../api"; // 방 입장 가능 여부 API

const RoomReady = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("roomId");
  const { isLogin, jwtToken } = useLoginContext(); // 로그인 상태 확인
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 메시지 상태

  // API 자동 호출
  useEffect(() => {
    const checkRoomAvailability = async () => {
      try {
        // 방 입장 가능 여부 확인
        const response = await joinRoomAvailability(roomId);
        if (response) {
          // 방 입장이 가능하면 게임 URL로 리다이렉트
          window.history.replaceState(null, "", "/room"); // 뒤로가기를 눌렀을 때 방 리스트로 이동
          const gameUrl = `http://game.eternalsnowman.com/room?roomId=${response.roomId}&clientId=${response.clientId}`;
          window.location.href = gameUrl; // 브라우저에서 외부 URL로 이동
        } else {
          alert(response.message || "방 입장이 불가능합니다.");
          setError(response.message || "방 입장이 불가능합니다.");
          if (isLogin && jwtToken) {
            window.location.href = "/room"; // 방 목록 페이지로 이동
          } else {
            window.location.href = "/";
          }
        }
      } catch (error) {
        alert(error.response?.data?.message || "방 입장 여부를 확인할 수 없습니다. 다시 시도해주세요.");
        setError(error.response?.data?.message || "방 입장 여부를 확인할 수 없습니다. 다시 시도해주세요.");
        if (isLogin && jwtToken) {
          window.location.href = "/room"; // 방 목록 페이지로 이동
        } else {
          setLoading(false); // 로딩 완료
          window.location.href = "/";
        }
      }
    };

    if (roomId) {
      checkRoomAvailability(); // roomId가 존재할 경우만 API 호출
    } else {
      setError("유효하지 않은 방 ID입니다.");
      setLoading(false);
    }
  }, [roomId, isLogin, jwtToken]);

  // 로딩 상태 중 대기 화면 유지
  if (loading) {
    return (
      <div>
        <h1>대기 페이지</h1>
        <p>{roomId}번 방 입장 여부를 확인 중입니다...</p>
      </div>
    );
  }

  // 에러 발생 시 에러 메시지 표시
  if (error) {
    return (
      <div>
        <h1>에러 발생</h1>
        <p>{error}</p>
        <button onClick={() => (window.location.href = "/room")}>방 목록으로 돌아가기</button>
      </div>
    );
  }

  // 성공적으로 처리되면 대기 화면 유지 (일반적으로 여기까지는 도달하지 않음)
  return (
    <div>
      <h1>대기 페이지</h1>
      <p>게임으로 이동 중입니다...</p>
    </div>
  );
};

export default RoomReady;
