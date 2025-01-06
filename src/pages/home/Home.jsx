import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import { loginGuest, fetchPosts } from "../../api.js";
import { useLoginContext } from "../../contexts/LoginContext.jsx";
import { useClickLock } from '../../contexts/ClickLockContext.jsx';
import Snowfall from "../../utils/SnowFall.jsx"; // Snowfall 경로 맞추기
import PostBox from "../../components/PostBox.jsx"; // PostBox 컴포넌트 가져오기
import LoadingSpinner from "../../components/LoadingSpinner";
import SendAuthCode from "../../utils/SendAuthCode.jsx"; // 인증 코드 처리 컴포넌트 가져오기

import "./Home.css";
import log from 'loglevel';

const ActionButton = ({ handleClick, label }) => {
  return (
    <button className="home-button-room-list" onClick={handleClick}>
      {label}
    </button>
  );
};

const Home = () => {
  const { isLogin, setIsLogin, setUserRole } = useLoginContext(); // 로그인 상태 확인
  const { isLocked, lock, unlock } = useClickLock();
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const redirecting = params.get("redirecting") === "true";

    if (redirecting) {
      setIsLoading(true); // 로딩 시작
    }
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsData = await Promise.all([
          fetchPosts({ page: 1, limit: 10 }), // 게시물 리스트 가져오기
        ]);
        setPosts(postsData.data || []);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
        alert("데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchData();
  }, []);

  const handleButtonClick = () => {
    if (isLocked) return; // 중복 클릭 방지
    if (isLogin) {
      navigate("/room");
      unlock();
    } else {
      navigate("/login");
      unlock();
    }
  };

  // 비회원 로그인 시
  const handleLoginGuest = async () => {
    if (isLocked) return; // 중복 클릭 방지
    lock();
    try {
      const response = await loginGuest(); // 서버와 통신하여 토큰 수신
      setIsLogin(true); // 로그인 상태 업데이트
      setUserRole(response.role);
      log.info("비회원 Login 성공:", response);
      alert("비회원으로 로그인되었습니다.");
      navigate("/"); // 홈 화면으로 이동
    } catch (error) {
      console.error("비회원 로그인 처리 중 오류 발생:", error.message);
      alert("비회원 로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      unlock();
    }
  };

  if (isLoading) {
    return <LoadingSpinner />; // 로딩 중에는 로딩 스피너 표시
  }

  return (
    <div>
      <Snowfall /> {/* 눈 효과 추가 */}
      <SendAuthCode /> {/* 인증 코드 처리 컴포넌트 */}

      <div className="home-image-container">
        <ActionButton
          handleClick={handleButtonClick}
          label={isLogin ? "GAME START" : "LOGIN"}
        />
        {!isLogin && (
          <ActionButton
            handleClick={handleLoginGuest}
            label="비회원 로그인"
          />
        )}
      </div>


      <PostBox posts={posts} /> {/* 게시물 */}
    </div>
  );
};

ActionButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default Home;
