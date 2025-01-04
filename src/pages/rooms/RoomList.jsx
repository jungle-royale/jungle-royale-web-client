import { useState, useEffect } from "react";
import { fetchRooms } from "../../api";
// import { useClickLock } from "../../contexts/ClickLockContext";
import useSafeNavigation from "../../hooks/useSafeNavigation";
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
  const [roomIdForNavigation, setRoomIdForNavigation] = useState(""); // Navigation용 roomId 저장
  const [isRoomCreaterOpen, setRoomCreaterOpen] = useState(false);
  const {navigateSafely} = useSafeNavigation();

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

  const handleJoinRoom = (room) => {
    const staticUrl = `${import.meta.env.VITE_API_BASE_URL}/rooms/ready?roomId=${room.id}`;
    setQRData(staticUrl); // QR 데이터 설정
    setRoomIdForNavigation(room.id); // 클릭용 roomId 설정
    setQRCodeOpen(true); // QR 코드 모달 열기
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
          <button
            onClick={(event) =>
              navigateSafely(event, `/rooms/ready?roomId=${roomIdForNavigation}`)
            }
          >
            바로가기
          </button>
        </Modal>
      <Modal isOpen={isRoomCreaterOpen} onClose={() => setRoomCreaterOpen(false)}>
        <RoomCreater />
      </Modal>
    </div>
  );
};

export default RoomList;
