// import { useEffect, useState } from "react";
// import { useClickLock } from '../contexts/ClickLockContext';
// import { useLoginContext } from "../contexts/LoginContext";
// import { loginWithKakao } from "../api";
// import LoadingSpinner from "../components/LoadingSpinner"; // 로딩 스피너 컴포넌트 가져오기
// import log from 'loglevel';

// const SendAuthCode = () => {
//   const { isLocked, lock, unlock } = useClickLock();
//   const { setIsLogin, setUserRole } = useLoginContext();
//   const [isProcessingAuthCode, setIsProcessingAuthCode] = useState(false); // 인가 코드 처리 상태

//   const sendCodeToServer = async (authCode) => {
//     if (isLocked) return; // 중복 클릭 방지
//     lock();
//     try {
//       const response = await loginWithKakao(authCode); // 서버와 통신
//       setIsLogin(true); // 로그인 상태 업데이트
//       setUserRole(response.role);
//     } catch (error) {
//       log.error("서버 응답:", error.response?.data || error.message);
//     } finally {
//       unlock();
//       setIsProcessingAuthCode(false); // 처리 완료
//     }
//   };

//   useEffect(() => {
//     const url = new URL(window.location.href);
//     const code = url.searchParams.get("code");

//     if (code) {
//       // 인가 코드가 있으면 처리 상태를 바로 true로 설정
//       setIsProcessingAuthCode(true);
//       log.info("Authorization Code:", code);
//       sendCodeToServer(code).finally(() => {
//         // URL에서 code 제거
//         window.history.replaceState({}, document.title, url.pathname);
//       });
//     }
//   }, []);

//   // 인가 코드 처리 중일 때 로딩 화면 유지
//   if (isProcessingAuthCode) {
//     return <LoadingSpinner />;
//   }

//   // 인가 코드가 없거나 처리 완료 후에는 아무것도 렌더링하지 않음
//   return null;
// };

// export default SendAuthCode;
