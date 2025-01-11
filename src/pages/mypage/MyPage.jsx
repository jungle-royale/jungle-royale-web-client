import { useEffect, useState } from "react";
import Input from "../../components/Input.jsx"; 
import log from 'loglevel';
import { fetchMyPage, myPageEdit } from "../../api.js";

const MyPage = () => {
  const [nickname, setNickname] = useState("");

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSaveNickname = async () => {
    try {
      await myPageEdit(nickname); // Update nickname
      alert("닉네임이 성공적으로 변경되었습니다."); // Success alert
      const response = await fetchMyPage();
      setNickname(response.data.username || ""); // Update nickname
    } catch (error) {
      alert("닉네임 변경 중 오류가 발생했습니다.");
      log.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMyPage();
        setNickname(response.data.username || "");
      } catch (error) {
        log.error("마이페이지 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative pt-20 pb-20"
      style={{
        backgroundImage: `url(/assets/snowy_background.png)`,
      }}
    >
      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-6 w-full max-w-md z-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">닉네임 정보</h2>
        <Input
          label="닉네임"
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="닉네임 입력"
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSaveNickname}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          닉네임 저장
        </button>
      </div>
    </div>
  );
};

export default MyPage;
