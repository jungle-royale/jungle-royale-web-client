import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // 올바른 import 방식

const useJwtSub = (token) => {
  const [sub, setSub] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // JWT 디코딩
        console.log("Decoded JWT Token:", decodedToken); // 디버깅 로그
        setSub(decodedToken.sub || null);
      } catch (error) {
        console.error("JWT 디코딩 오류:", error.message);
        setSub(null); // 오류 시 `sub`을 null로 설정
      }
    } else {
      console.log("토큰 없음");
      setSub(null); // 토큰이 없을 경우 `sub`을 null로 설정
    }
  }, [token]);

  return sub; // `sub` 반환
};

export default useJwtSub;
