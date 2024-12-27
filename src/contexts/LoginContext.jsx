import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

// Context 생성
const LoginContext = createContext();

// Context Provider 컴포넌트
export const LoginProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(() => {
    const loginStatus = localStorage.getItem("isLogin");
    return loginStatus === "true" || false;
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("role") || ""; // 역할 초기화
  });

  // isLogin 상태와 localStorage 동기화
  useEffect(() => {
    localStorage.setItem("isLogin", isLogin.toString());
    console.debug("isLogin 상태 동기화됨:", isLogin);
  }, [isLogin]);

  // userRole 상태와 localStorage 동기화
  useEffect(() => {
    localStorage.setItem("userRole", userRole);
    console.debug("userRole 상태 동기화됨:", userRole);
  }, [userRole]);

  // 다른 탭에서 localStorage 변화 리스닝
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "isLogin") {
        setIsLogin(event.newValue === "true");
      }
      if (event.key === "userRole") {
        setUserRole(event.newValue || "");
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <LoginContext.Provider value={{ isLogin, setIsLogin, userRole, setUserRole }}>
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
