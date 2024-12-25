import { useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useRooms } from "../contexts/RoomsContext";
import { createRoom } from "../api";

const RoomCreater = () => {
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxGameTime, setMaxGameTime] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const isLoadingRef = useRef(false);
  const [map, setMap] = useState('');
  const { addRoom } = useRooms(); // RoomsContext에서 addRoom 가져오기
  const navigate = useNavigate();


  const handleCreateRoom = async () => {
    if (isLoadingRef.current) {
      console.warn("중복 요청 방지: 이미 요청 중입니다.");
      return; // 중복 요청 방지
    }
  
    isLoadingRef.current = true; // 로딩 상태 시작
  
    const roomDetails = {
      title: roomName,
      maxPlayers: parseInt(maxPlayers, 10),
      minPlayers: parseInt(minPlayers, 10),
      maxGameTime: parseInt(maxGameTime, 10),
      secret: isSecret,
      map,
    };
  
    try {
      console.log("방 생성 요청 데이터:", roomDetails); // 요청 데이터 확인
      const response = await createRoom(roomDetails); // API 요청
      console.log("create 성공:", response);
  
      addRoom({
        id: response.data.id, // 서버에서 반환된 ID 사용
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
      isLoadingRef.current = false; // 로딩 상태 복구
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1>방 만들기</h1>
      <Input
        label="방 이름"
        type="text"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="방 이름을 입력하세요"
      />
      <Input
        label="최소 인원"
        type="number"
        value={minPlayers}
        onChange={(e) => setMinPlayers(e.target.value)}
        placeholder="최소 인원을 입력하세요"
      />
      <Input
        label="최대 인원"
        type="number"
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(e.target.value)}
        placeholder="최대 인원을 입력하세요"
      />
      <Input
        label="게임 소요 시간 (분)"
        type="number"
        value={maxGameTime}
        onChange={(e) => setMaxGameTime(e.target.value)}
        placeholder="게임 소요 시간을 입력하세요"
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
          <option value="desert">사막</option>
          <option value="forest">숲</option>
          <option value="city">도시</option>
        </select>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>공개 여부</label>
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
      <Button
        text={isLoadingRef.current ? "생성 중..." : "방 생성"}
        onClick={handleCreateRoom}
        disabled={isLoadingRef.current} // 로딩 중일 때 버튼 비활성화
      />
    </div>
  );
};

export default RoomCreater;