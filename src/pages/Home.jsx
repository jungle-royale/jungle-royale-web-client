import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { loginGuest } from "../api";
import { useLoginContext } from "../contexts/LoginContext";
import { useClickLock } from '../contexts/ClickLockContext';

import "./Home.css";

const Home = () => {
  const { isLogin, setIsLogin } = useLoginContext(); // 로그인 상태 확인
  const { isLocked, lock, unlock } = useClickLock();


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
      <div className="image"></div> 
        <Button
          text={isLogin ? "GAME START" : "LOGIN"}
          type="button-room-list"
          onClick={handleButtonClick}
        />
        <Button
          text={isLogin ? "닉네임" : "비회원 로그인"}
          type="button-room-list"
          onClick={isLogin ? handleButtonClick : handleLoginGuest }
        />
      </div>
  
  );
};

export default Home;
