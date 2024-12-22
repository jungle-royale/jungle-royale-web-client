// useLoginStatus.jsx
import { useState, useEffect } from "react";

function useLoginStatus() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLogin");
    setIsLogin(loginStatus === "true");
  }, []); 

  const updateLoginStatus = (status) => {
    localStorage.setItem("isLogin", status.toString());
    setIsLogin(status);
  };

  return [isLogin, updateLoginStatus];
}

export default useLoginStatus;
