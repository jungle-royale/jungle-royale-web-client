import { useState } from 'react';
import { createRoom } from "../../api";
import { useClickLock } from '../../contexts/ClickLockContext';
import Input from "../../components/Input";
import "./RoomCreater.css"
import log from 'loglevel';


const RoomCreater = () => {
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxGameTime, setMaxGameTime] = useState('');
  const [errors, setErrors] = useState({});
  const { isLocked, lock, unlock } = useClickLock();

  // 랜덤 제목 목록
  const randomTitles = [
    "신나는 방",
    "모험의 시작",
    "숨겨진 보물찾기",
    "치열한 전투",
    "평화로운 마을",
  ];
    
  const validateField = (name, value) => {
    let error = "";
    if (name === "minPlayers") {
      if (!value || parseInt(value, 10) < 2 || parseInt(value, 10) > 100) {
        error = "최소 인원은 2에서 100 사이의 값이어야 합니다.";
      }
    }
    // if (name === "maxPlayers") {
    //   if (!value || parseInt(value, 10) < 2 || parseInt(value, 10) > 100) {
    //     error = "최대 인원은 2에서 100 사이의 값이어야 합니다.";
    //   } else if (parseInt(value, 10) < parseInt(minPlayers, 10)) {
    //     error = "최대 인원은 최소 인원보다 커야 합니다.";
    //   }
    // }
    if (name === "maxGameTime") {
      if (!value || parseInt(value, 10) < 1 || parseInt(value, 10) > 10) {
        error = "게임 소요 시간은 1에서 10 사이의 값이어야 합니다.";
      }
    }
    return error;
  };
  
  const handleChange = (name, value) => {
    const newErrors = { ...errors };
    const error = validateField(name, value);
    if (error) {
      newErrors[name] = error;
    } else {
      delete newErrors[name];
    }
  
    setErrors(newErrors);
  
    if (name === "minPlayers") setMinPlayers(value);
    if (name === "maxPlayers") setMaxPlayers(value);
    if (name === "maxGameTime") setMaxGameTime(value);
  };
  
  
  const handleCreateRoom = async () => {
    const newErrors = {};
  
    // 모든 필드 검증
    newErrors.minPlayers = validateField("minPlayers", minPlayers);
    newErrors.maxPlayers = validateField("maxPlayers", maxPlayers);
    newErrors.maxGameTime = validateField("maxGameTime", maxGameTime);
  
    // 에러가 있는 경우, 상태 업데이트 후 종료
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      unlock();
      return;
    }
  
    // 랜덤 제목 선택
    const defaultRoomName = randomTitles[Math.floor(Math.random() * randomTitles.length)];
  
    const roomDetails = {
      title: roomName || defaultRoomName, // 입력값 없으면 랜덤 제목 사용
      maxPlayers: 100,
      minPlayers: parseInt(minPlayers, 10),
      maxGameTime: parseInt(maxGameTime, 10),
    };
  
    try {
      const response = await createRoom(roomDetails); // API 요청
      log.info("방 생성 성공:", response);
      const { roomId, clientId } = response.data;
      alert("방이 성공적으로 생성되었습니다!");
      window.history.pushState({ from: "RoomCreater" }, "", "/room");
      window.location.href = `http://game.eternalsnowman.com/room?roomId=${roomId}&clientId=${clientId}`;
    } catch (error) {
      console.error("방 생성 중 오류 발생:", error.response?.data || error.message);
      alert("방 생성 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      unlock();
    }
  };

  return (
    <div className='room-creater-main'>
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
              onChange={(e) => handleChange("minPlayers", e.target.value)}
              placeholder="최소 인원을 입력하세요(2~100)"
              className={`room-input ${
                errors.minPlayers ? "room-input-error" : minPlayers ? "room-input-valid" : ""
              }`}
            />
            {errors.minPlayers && <div className="room-error-message">{errors.minPlayers}</div>}

            {/* <Input
              label="최대 인원"
              type="number"
              value={maxPlayers}
              onChange={(e) => handleChange("maxPlayers", e.target.value)}
              placeholder="최대 인원을 입력하세요(2~100)"
              className={`room-input ${
                errors.maxPlayers ? "room-input-error" : maxPlayers ? "room-input-valid" : ""
              }`}          />
            {errors.maxPlayers && <div className="room-error-message">{errors.maxPlayers}</div>} */}

            <Input
              label="게임 소요 시간 (분)"
              type="number"
              value={maxGameTime}
              onChange={(e) => handleChange("maxGameTime", e.target.value)}
              placeholder="게임 소요 시간을 입력하세요(1~10)"
              className={`room-input ${
                errors.maxGameTime ? "room-input-error" : maxGameTime ? "room-input-valid" : ""
              }`}          />
            {errors.maxGameTime && <div className="room-error-message">{errors.maxGameTime}</div>}
        </div>
        <button
          className='room-create-button'
          onClick={() => {
              if (!isLocked) {
                lock();
                handleCreateRoom();
              }
            }} disabled={isLocked}
          >
          {isLocked ? "방 생성" : "방 생성"}
        </button>
      </div>
    </div>
  );
};

export default RoomCreater;
