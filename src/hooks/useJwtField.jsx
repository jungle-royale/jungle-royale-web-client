import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"


const useJwtField  = (token, field) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // JWT 디코딩
        console.log("Decoded JWT Token:", decodedToken); // 디버깅 로그
        setValue(decodedToken[field] || null);
      } catch (error) {
        console.error("JWT 디코딩 오류:", error.message);
        setValue(null); // 오류 시 `value`을 null로 설정
      }
    } else {
      console.log("토큰 없음");
      setValue(null); // 토큰이 없을 경우 `value`을 null로 설정
    }
  }, [token, field]);

  return value; // `value` 반환
};

export default useJwtField ;
