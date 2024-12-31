import { useEffect, useState } from "react";
import Input from "../components/Input";
import { fetchMyPage, myPageEdit } from '../api.js';
import ThreeCanvas from "../components/ThreeCanvas"; // ThreeCanvas 컴포넌트 임포트
import "./MyPage.css";

const MyPage = () => {
  const [nickname, setNickname] = useState('');

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSaveNickname = async () => {
    try {
      await myPageEdit(nickname); // 닉네임 업데이트
      alert('닉네임이 성공적으로 변경되었습니다.');
      const response = await fetchMyPage(); // 닉네임 변경 후 최신 데이터 가져오기
      setNickname(response.data.username || '');
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      alert('닉네임 변경 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMyPage(); // 초기 닉네임 데이터 가져오기
        console.log("Response: ", response.data);
        setNickname(response.data.username || '');
      } catch (error) {
        console.error('마이페이지 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mypage-container">
      <ThreeCanvas className="mypage-three-canvas"/> {/* 3D 캔버스 컴포넌트를 여기에 추가 */}
      <div className="mypage-form">
        <h2>닉네임 정보</h2>
        <Input 
          label="닉네임" 
          type="text" 
          value={nickname} 
          onChange={handleNicknameChange} 
          placeholder="닉네임 입력" 
        />
        <button onClick={handleSaveNickname}>닉네임 저장</button>
      </div>
    </div>
  );
};

export default MyPage;
