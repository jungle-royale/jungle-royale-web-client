import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRooms, checkRoomAvailability } from "../api";
import { useRooms } from "../contexts/RoomsContext";
import RoomCard from "../components/RoomCard";
import Button from "../components/Button";
import './RoomList.css';


const RoomList = () => {
  const { rooms, setRooms } = useRooms();
  const [userName, setUserName] = useState(""); // 유저 이름 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchRooms(); // API 호출
        console.log("list: ", response);
        setRooms(response.data.gameRooms); // 상태 업데이트
        setUserName(response.data.userInfo.username); // 유저 이름 상태 업데이트
      } catch (error) {
        console.error("방 목록을 불러오는 중 오류 발생:", error);
      }
    };

    loadRooms();
  }, [setRooms]);

  return (
    <div>
      <div>
        <Button text="Room Creater" onClick={() => navigate("/roomcreater")} />
      </div>
      <div className="user-info">
        <p>안녕하세요, {userName}님!</p>
      </div>
      <div className="room-page">
        <h1>게임 방 목록</h1>
        <div className="room-list">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              roomName={room.title}
              currentPlayers={room.currentPlayers}
              maxPlayers={room.maxPlayers}
              isPlaying={room.status}
              onJoin={async () => {
                try {
                  // 서버에 방 입장 가능 여부 요청
                  const message = await checkRoomAvailability(room.id);
            
                  if (message === "GAME_JOIN_AVAILABLE") {
                    console.log(`${room.title}에 입장합니다.`);
                    // 실제 방 입장 로직 추가
                    navigate("/game"); // gameUrl로 이동

                  } else {
                    alert(`입장 불가: ${message}`); // 서버에서 반환된 메시지 출력
                    window.location.reload(); // 페이지 새로고침
                  }
                } catch (error) {
                  console.error("입장 가능 여부 확인 중 오류 발생:", error);
                  alert("입장 가능 여부를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.");
                  window.location.reload(); // 페이지 새로고침
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomList;
