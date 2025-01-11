import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"
import log from 'loglevel';



const useJwtField  = (token, field) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // JWT 디코딩
        log.info("Decoded JWT Token:", decodedToken); // 디버깅 로그
        setValue(decodedToken[field] || null);
      } catch (error) {
        log.error("JWT 디코딩 오류:", error.message);
        setValue(null); // 오류 시 `value`을 null로 설정
      }
    } else {
      log.info("토큰 없음");
      setValue(null); // 토큰이 없을 경우 `value`을 null로 설정
    }
  }, [token, field]);

  return value; // `value` 반환
};

export default useJwtField ;
