import { useState, useEffect } from "react";

function useLoginStatus() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLogin");
    setIsLogin(loginStatus === "true");
  }, []);

  return [isLogin, setIsLogin];
}

export default useLoginStatus;