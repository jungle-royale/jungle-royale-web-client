import { useNavigate } from "react-router-dom";
import { useClickLock } from "../contexts/ClickLockContext";

const useSafeNavigation = () => {
  const { isLocked, lock, unlock } = useClickLock();
  const navigate = useNavigate();

  const navigateSafely = (event, href) => {
    if (isLocked) {
      event.preventDefault();
      return;
    }
    lock();
    try {
      navigate(href); // React Router를 사용한 이동
    } finally {
      unlock();
    }
  };

  return { navigateSafely };
};

export default useSafeNavigation;
