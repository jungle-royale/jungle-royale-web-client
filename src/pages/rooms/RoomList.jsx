import { useState, useEffect } from "react";
import { fetchRooms, joinRoomAvailability } from "../../api";
import { useClickLock } from "../../contexts/ClickLockContext";
import Modal from "../../components/Modal";
import RoomCreater from "./RoomCreater";
import RoomCard from "../../components/RoomCard";
import StompChat from "../../components/StompChat";
import QRcode from "../../utils/QRcode";
import "./RoomList.css";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [userName, setUserName] = useState("");
  const [isQRCodeOpen, setQRCodeOpen] = useState(false);
  const [qrData, setQRData] = useState("");
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

  const handleJoinRoom = async (room) => {
    if (isLocked) return;
    lock();
    try {
      const response = await joinRoomAvailability(room.id);
      const url = `http://game.eternalsnowman.com/rooms?roomId=${response.roomId}&clientId=${response.clientId}`;
      setQRData(url);
      setQRCodeOpen(true);
    } catch (error) {
      console.error("입장 가능 여부 확인 중 오류 발생:", error.errorCode);
      alert("입장 가능 여부를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.");
      window.location.reload();
    } finally {
      unlock();
    }
  };

  return (
    <div className="room-list-container">
      <div className="room-user-info">
        <p>안녕하세요, {userName}님!</p>
      </div>
      <div className="room-chat-container">
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
                onJoin={() => handleJoinRoom(room)}
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
      <Modal isOpen={isQRCodeOpen} onClose={() => setQRCodeOpen(false)}>
        <QRcode qrdata={qrData} />
      </Modal>
      <Modal isOpen={isRoomCreaterOpen} onClose={() => setRoomCreaterOpen(false)}>
        <RoomCreater />
      </Modal>
    </div>
  );
};

export default RoomList;
