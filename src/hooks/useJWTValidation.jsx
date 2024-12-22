//클라에서 jwt 검증 필요 시

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// /**
//  * JWT를 검증하는 커스텀 훅.
//  * @param {string} expectedIssuer - 예상되는 발급자(issuer, iss).
//  * @param {string} expectedAudience - 예상되는 수신자(audience, aud).
//  */
const useJWTValidation = (expectedIssuer, expectedAudience) => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateJWT = () => {
      const jwtToken = localStorage.getItem("jwt_token");

      // 1. 토큰이 없으면 로그인 페이지로 이동
      if (!jwtToken) {
        console.warn("JWT token not found, redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        // 2. 토큰 형식 검증 (header.payload.signature)
        const tokenParts = jwtToken.split(".");
        if (tokenParts.length !== 3) {
          console.error("Invalid JWT format, redirecting to login...");
          navigate("/login");
          return;
        }

        // 3. 페이로드 디코딩
        const payloadBase64 = tokenParts[1];
        const payload = JSON.parse(atob(payloadBase64)); // Base64 디코딩 후 JSON 파싱

        // 4. 만료 시간(exp) 검증
        const currentTime = Math.floor(Date.now() / 1000); // 현재 시간(초 단위)
        if (payload.exp && payload.exp < currentTime) {
          console.warn("JWT token expired, redirecting to login...");
          navigate("/login");
          return;
        }

        // // 5. 발급자(iss) 검증
        // if (expectedIssuer && payload.iss !== expectedIssuer) {
        //   console.error(`JWT issuer mismatch. Expected: ${expectedIssuer}, Found: ${payload.iss}`);
        //   navigate("/login");
        //   return;
        // }

        // // 6. 수신자(aud) 검증
        // if (expectedAudience && payload.aud !== expectedAudience) {
        //   console.error(`JWT audience mismatch. Expected: ${expectedAudience}, Found: ${payload.aud}`);
        //   navigate("/login");
        //   return;
        // }

        // 7. 성공적으로 검증되었음을 로그
        console.log("JWT token is valid:", payload);

      } catch (error) {
        console.error("Error validating JWT token:", error.message);
        navigate("/login");
      }
    };

    validateJWT();
  }, [navigate, expectedIssuer, expectedAudience]);
};

export default useJWTValidation;
