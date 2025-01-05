import { useEffect } from "react";
import {refreshAccessToken} from "../api";
import useJwtField from "./useJwtField.jsx";

const useTokenRefresh = () => {
  const jwtToken = localStorage.getItem("jwt_token");
  const exp = useJwtField(jwtToken, "exp");

  useEffect(() => {
    const refreshInterval = () => {
      const expiresIn = parseInt(exp, 10);
      console.log(`expiresIn: ${expiresIn}`); // 만료 시간 확인

      if (expiresIn) {
        const timeUntilRefresh = expiresIn - 60 * 1000; // 만료 1분 전 (60초)
        setTimeout(() => {
          console.log("Calling refreshAccessToken...");
          refreshAccessToken();
        }, timeUntilRefresh);      }
    };

    refreshInterval();
    
    const intervalId = setInterval(() => {
      console.log("15-minute interval check");
      refreshInterval();
    }, 15 * 60 * 1000); // 15분마다 실행
    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 타이머 정리
  }, []);
};

export default useTokenRefresh;
