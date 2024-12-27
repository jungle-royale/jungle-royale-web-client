import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createRoom } from "../api";
import { useRooms } from "../contexts/RoomsContext";
import { useClickLock } from '../contexts/ClickLockContext';
import Input from "../components/Input";
import "./RoomCreater.css"


const RoomCreater = () => {
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxGameTime, setMaxGameTime] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [map, setMap] = useState('');
  const { addRoom } = useRooms(); // RoomsContext에서 addRoom 가져오기
  const { isLocked, lock, unlock } = useClickLock();

  const navigate = useNavigate();

    // 랜덤 제목 목록
    const randomTitles = [
      "신나는 방",
      "모험의 시작",
      "숨겨진 보물찾기",
      "치열한 전투",
      "평화로운 마을",
    ];

  const handleCreateRoom = async () => {
    // 랜덤 제목 선택
    const defaultRoomName =
    randomTitles[Math.floor(Math.random() * randomTitles.length)];

    // 유효성 검사
    if (!minPlayers || parseInt(minPlayers, 10) < 2 || parseInt(minPlayers, 10) > 100) {
      alert("최소 인원은 2에서 100 사이의 값이어야 합니다.");
      unlock(); // 잠금 해제
      return;
    }
    if (!maxPlayers || parseInt(maxPlayers, 10) < 2 || parseInt(maxPlayers, 10) > 100) {
      alert("최대 인원은 2에서 100 사이의 값이어야 합니다.");
      unlock(); // 잠금 해제
      return;
    }
    if (parseInt(maxPlayers, 10) < parseInt(minPlayers, 10)) {
      alert("최대 인원은 최소 인원보다 커야 합니다.");
      unlock(); // 잠금 해제
      return;
    }
    if (!maxGameTime || parseInt(maxGameTime, 10) < 1 || parseInt(maxGameTime, 10) > 10) {
      alert("게임 소요 시간은 1에서 10 사이의 값이어야 합니다.");
      unlock(); // 잠금 해제
      return;
    }
    if (!map) {
      alert("맵을 선택해주세요.");
      unlock(); // 잠금 해제
      return;
    }
      
    const roomDetails = {
      title: roomName || defaultRoomName, // 입력값 없으면 랜덤 제목 사용
      maxPlayers: parseInt(maxPlayers, 10),
      minPlayers: parseInt(minPlayers, 10),
      maxGameTime: parseInt(maxGameTime, 10),
      secret: isSecret,
      map,
    };
  
    try {
      const response = await createRoom(roomDetails); // API 요청
      console.log("create 성공:", response);

      addRoom({
        id: response.data.id, 
        title: response.data.title,
        currentPlayers: response.data.currentPlayers,
        maxPlayers: response.data.maxPlayers,
        status: response.data.status,
      });
  
      alert("방이 성공적으로 생성되었습니다!");
      navigate("/rooms"); // RoomList로 이동
    } catch (error) {
      console.error("방 생성 중 오류 발생:", error.response?.data || error.message);
      alert("방 생성 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      unlock();
    }
  };

  return (
    <div className='room-creater-container'>
      <h1>방 만들기</h1>
        <div className='room-input'>
          <Input
            label="방 이름"
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="방 이름을 입력하세요(미입력시 랜덤)"
          />
          <Input
            label="최소 인원"
            type="number"
            value={minPlayers}
            onChange={(e) => setMinPlayers(e.target.value)}
            placeholder="최소 인원을 입력하세요"
            min="2"
            max="100"
          />
          <Input
            label="최대 인원"
            type="number"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(e.target.value)}
            placeholder="최대 인원을 입력하세요"
            min="2"
            max="100"
          />
          <Input
            label="게임 소요 시간 (분)"
            type="number"
            value={maxGameTime}
            onChange={(e) => setMaxGameTime(e.target.value)}
            placeholder="게임 소요 시간을 입력하세요"
            min="1"
            max="10"
          />
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>맵 선택</label>
            <select
              value={map}
              onChange={(e) => setMap(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
            <option value="" disabled>맵을 선택하세요</option>
            <option value="snow">눈</option>
            <option value="forest">숲</option>
            <option value="city">도시</option>
          </select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>비공개 여부</label>
          <input
            type="checkbox"
            checked={isSecret}
            onChange={(e) => setIsSecret(e.target.checked)}
            style={{
              width: 'auto',
              margin: '10px',
            }}
          />
        </div>
        <button onClick={() => {
            if (!isLocked) {
              lock();
              handleCreateRoom();
            }
          }} disabled={isLocked}>
          {isLocked ? "생성 중..." : "방 생성"}
        </button>
      </div>
    </div>
  );
};

export default RoomCreater;
