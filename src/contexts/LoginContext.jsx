import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import log from 'loglevel';

// Context 생성
const LoginContext = createContext();

// Context Provider 컴포넌트
export const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(() => {
    const loginStatus = localStorage.getItem("isLogin");
    return loginStatus === "true" || false;
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || ""; // 역할 초기화
  });

  const [jwtToken, setJwtToken] = useState(() => {
    return localStorage.getItem("jwt_token") || null; // JWT 초기화
  });

  // isLogin 상태와 localStorage 동기화
  useEffect(() => {
    localStorage.setItem("isLogin", isLogin.toString());
    log.debug("isLogin 상태 동기화됨:", isLogin);
  }, [isLogin]);

  // userRole 상태와 localStorage 동기화
  useEffect(() => {
    localStorage.setItem("userRole", userRole);
    log.debug("userRole 상태 동기화됨:", userRole);
  }, [userRole]);

  // jwtToken 상태와 localStorage 동기화
  useEffect(() => {
    if (jwtToken) {
      localStorage.setItem("jwt_token", jwtToken);
      log.debug("JWT Token 상태 동기화됨:", jwtToken);
    } else {
      localStorage.removeItem("jwt_token"); // 로그아웃 시 제거
      log.debug("JWT Token이 제거됨");
    }
  }, [jwtToken]);

  // 다른 탭에서 localStorage 변화 리스닝
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "isLogin") {
        setIsLogin(event.newValue === "true");
      }
      if (event.key === "userRole") {
        setUserRole(event.newValue || "");
      }
      if (event.key === "jwt_token") {
        setJwtToken(event.newValue || null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <LoginContext.Provider value={{ isLogin, setIsLogin, userRole, setUserRole, jwtToken, setJwtToken }}>
      {children}
    </LoginContext.Provider>
  );
};

LoginProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context를 사용하는 커스텀 훅
export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLoginContext must be used within a LoginProvider");
  }
  return context;
};