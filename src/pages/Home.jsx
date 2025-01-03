import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { loginGuest } from "../api";
import { useLoginContext } from "../contexts/LoginContext";
import { useClickLock } from '../contexts/ClickLockContext';
import Snowfall from "../utils/SnowFall.jsx"; // Snowfall 경로 맞추기
import Post from "../components/Post.jsx"; // Post 컴포넌트 가져오기
import Modal from "../components/Modal.jsx"; // 모달 컴포넌트 임포트
import QRcode from "../utils/QRcode.jsx";
import "./Home.css";

const Home = () => {
  const { isLogin, setIsLogin, setUserRole } = useLoginContext(); // 로그인 상태 확인
  const { isLocked, lock, unlock } = useClickLock();
    const [isQRModalOpen, setIsQRModalOpen] = useState(false); // 모달 열림 상태 관리
  
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLocked) return; // 중복 클릭 방지
    if (isLogin) {
      navigate("/rooms");
      unlock();
    } else {
      navigate("/login");
      unlock();
    }
  };

  //비회원 로그인 시
  const handleLoginGuest = async () => {
    if (isLocked) return; // 중복 클릭 방지
    lock();
      try {
      const response = await loginGuest(); // 서버와 통신하여 토큰 수신
      setIsLogin(true); // 로그인 상태 업데이트
      setUserRole(response.role)
      console.log("비회원 Login 성공:", response);
      alert("비회원으로 로그인되었습니다.");
      navigate("/"); // 홈 화면으로 이동
    } catch (error) {
      console.error("비회원 로그인 처리 중 오류 발생:", error.message);
      alert("비회원 로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      unlock();
    }
  };

  return (
    <div>
      <Snowfall /> {/* 눈 효과 추가 */}
      <div className="home-image-container">
        {isLogin && 
        <button className="home-button-room-list" onClick={() => setIsQRModalOpen(true)}>QRcode</button>
        }
        <button className="home-button-room-list" onClick={handleButtonClick}>
          {isLogin ? "GAME START" : "LOGIN"}
        </button>
        {!isLogin && (
          <button className="home-button-room-list" onClick={isLogin ? handleButtonClick : handleLoginGuest }>
            비회원 로그인
          </button>
        )}
      </div> 
      <Post />
      <Modal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)}>
        <QRcode />
      </Modal>
    </div>
  );
};

export default Home;
