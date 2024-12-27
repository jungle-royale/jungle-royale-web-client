import { useNavigate } from "react-router-dom";
import { useClickLock } from "../contexts/ClickLockContext";

const useSafeNavigation = () => {
  const { isLocked, lock, unlock } = useClickLock();
  const navigate = useNavigate();

  const navigateSafely = (event, href) => {
    if (isLocked) {
      event.preventDefault(); // 중복 클릭 방지
      return;
    }
    lock(); // 클릭 잠금 설정
    try {
      event.preventDefault(); // 기본 동작 방지
      navigate(href); // React Router를 사용한 이동
      // 잠금을 페이지 이동 후에 해제하도록 딜레이를 추가할 수도 있음
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setTimeout(unlock, 500); // 잠금 해제를 일정 시간 딜레이
    }
  };

  return { navigateSafely };
};

export default useSafeNavigation;
