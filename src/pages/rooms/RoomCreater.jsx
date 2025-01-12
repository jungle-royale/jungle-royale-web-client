import { useState } from 'react';
import { createRoom } from "../../api";
import { useClickLock } from '../../contexts/ClickLockContext';
import log from 'loglevel';

const RoomCreater = () => {
  const [roomName, setRoomName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxGameTime, setMaxGameTime] = useState('');
  const [errors, setErrors] = useState({});
  const { isLocked, lock, unlock } = useClickLock();

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
    newErrors.minPlayers = validateField("minPlayers", minPlayers);
    newErrors.maxPlayers = validateField("maxPlayers", maxPlayers);
    newErrors.maxGameTime = validateField("maxGameTime", maxGameTime);

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      unlock();
      return;
    }

    const defaultRoomName = randomTitles[Math.floor(Math.random() * randomTitles.length)];
    const roomDetails = {
      title: roomName || defaultRoomName,
      maxPlayers: 100,
      minPlayers: parseInt(minPlayers, 10),
      maxGameTime: parseInt(maxGameTime, 10),
    };

    try {
      const response = await createRoom(roomDetails);
      log.info("방 생성 성공:", response);
      const { roomId, clientId, username } = response.data;
      window.history.pushState({ from: "RoomCreater" }, "", "/room");
      window.location.href = `${import.meta.env.VITE_KAKAO_REDIRECT_URL}/room?roomId=${roomId}&clientId=${clientId}username=${username}`;
    } catch (error) {
      log.error("방 생성 중 오류 발생:", error.response?.data || error.message);
      alert("방 생성 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      unlock();
    }
  };

  return (
<div
  className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative pt-20 pb-20"
  style={{
    backgroundImage: `url(/assets/snowy_background.png)`,
  }}
>
  {/* 어두운 오버레이 */}
  <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

  {/* 네모 박스를 고정 크기로 설정 */}
  <div
    className="shadow-lg rounded-lg px-8 py-16 z-10 relative"
    style={{
      backgroundImage: `url(/assets/room_create_page.png)`,
      backgroundSize: "auto", // 이미지 크기를 고정 (반응형 비활성화)
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      width: "500px", // 고정된 너비
      height: "500px", // 고정된 높이
    }}
  >
    <div className="flex flex-col space-y-2">
      <div>
        <label className="block text-gray-700 font-medium mb-2">방 이름</label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="방 이름을 입력하세요(미입력 시 랜덤)"
          className="w-full px-6 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-lg"
        />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">최소 인원</label>
        <input
          type="number"
          value={minPlayers}
          onChange={(e) => handleChange("minPlayers", e.target.value)}
          placeholder="2 ~ 100명"
          className={`w-full px-6 py-2 border rounded-md outline-none text-lg ${
            errors.minPlayers ? "border-red-500" : "focus:ring-2 focus:ring-blue-400"
          }`}
        />
        {errors.minPlayers && <p className="text-red-500 text-sm mt-1">{errors.minPlayers}</p>}
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-2">게임 소요 시간 (분)</label>
        <input
          type="number"
          value={maxGameTime}
          onChange={(e) => handleChange("maxGameTime", e.target.value)}
          placeholder="1 ~ 10분"
          className={`w-full px-6 py-2 border rounded-md outline-none text-lg ${
            errors.maxGameTime ? "border-red-500" : "focus:ring-2 focus:ring-blue-400"
          }`}
        />
        {errors.maxGameTime && <p className="text-red-500 text-sm mt-1">{errors.maxGameTime}</p>}
      </div>
    </div>
  </div>
    <button
      className="w-full bg-blue-500 text-white py-4 text-lg rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
      onClick={() => {
        if (!isLocked) {
          lock();
          handleCreateRoom();
        }
      }}
      disabled={isLocked}
    >
      {isLocked ? "방 생성 중..." : "방 생성"}
    </button>
</div>


  );
};

export default RoomCreater;
