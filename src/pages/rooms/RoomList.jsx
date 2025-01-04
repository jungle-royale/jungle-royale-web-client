import { useState, useEffect } from "react";
import { fetchRooms, joinRoomAvailability } from "../../api";
import { useClickLock } from "../../contexts/ClickLockContext";
import Modal from "../../components/Modal";
import RoomCreater from "./RoomCreater";
import RoomCard from "../../components/RoomCard";
import StompChat from "../../components/StompChat";
import "./RoomList.css";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [userName, setUserName] = useState("");
  const { isLocked, lock, unlock } = useClickLock();
  const [isRoomCreaterOpen, setRoomCreaterOpen] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchRooms();
        setRooms(response.data.gameRooms);
        setUserName(response.data.userInfo.username);
      } catch (error) {
        console.error("방 목록을 불러오는 중 오류 발생:", error);
      }
    };
    loadRooms();
  }, []);

  return (
    <div className="room-list-container">
      {/* 유저 정보 */}
      <div className="room-user-info">
        <p>안녕하세요, {userName}님!</p>
      </div>

      {/* 방 목록 및 채팅창을 포함하는 컨테이너 */}
      <div className="room-chat-container">
        {/* 기존 코드: 방 목록 */}
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
                  if (isLocked) return;
                  lock();
                  try {
                    const response = await joinRoomAvailability(room.id);
                    console.log(`${room.title}에 입장합니다.`);
                    window.location.href = `http://game.eternalsnowman.com/room?roomId=${response.roomId}&clientId=${response.clientId}`;
                  } catch (error) {
                    console.error(
                      "입장 가능 여부 확인 중 오류 발생:",
                      error.errorCode
                    );
                    alert(
                      "입장 가능 여부를 확인할 수 없습니다. 잠시 후 다시 시도해주세요."
                    );
                    window.location.reload();
                  } finally {
                    unlock();
                  }
                }}
              />
            ))}
            <img
              src="/assets/pluscircle.png"
              className="room-creater-go"
              alt="Room Creater"
              onClick={() => setRoomCreaterOpen(true)}
            />
          </div>
        </div>
        <StompChat />
      </div>

      {/* 기존 코드: 방 생성 모달 */}
      <Modal isOpen={isRoomCreaterOpen} onClose={() => setRoomCreaterOpen(false)}>
        <RoomCreater />
      </Modal>
    </div>
  );
};

export default RoomList;
