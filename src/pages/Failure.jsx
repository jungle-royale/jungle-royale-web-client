// import "./Failure.css";
import { useSearchParams } from "react-router-dom";
import useSafeNavigation from "../hooks/useSafeNavigation";

const Failure = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const {navigateSafely} = useSafeNavigation();

  //메세지 매핑 예시
  // const errorMessages = {
  //   "ROOM_NOT_FOUND": "입장하려는 방을 찾을 수 없습니다.",
  //   "ROOM_FULL": "방이 가득 찼습니다. 다른 방을 선택해주세요.",
  //   "INVALID_ROOM": "잘못된 방 정보입니다. 다시 확인해주세요.",
  //   "UNKNOWN_ERROR": "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
  // };

  // const errorMessage = errorMessages[code] || errorMessages["UNKNOWN_ERROR"];
  const errorMessage = code || "UNKNOWN_ERROR";

  return (
    <div className="failure-container">
      <div className="failure-box">
        <p>{errorMessage}</p>
        <button className="failure-retry-button" onClick={(e) => navigateSafely(e, "/")}>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default Failure;
