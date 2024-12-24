import { createContext, useContext, useState, useEffect } from "react";
import { fetchRooms } from "../api";
import PropTypes from "prop-types";

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);

  const addRoom = (newRoom) => {
    if (!newRoom.title) {
      console.error("방 이름이 누락되었습니다:", newRoom);
      return;
    }

    setRooms((prevRooms) => [...prevRooms, newRoom]);
  };
    // 서버에서 방 목록 가져오기
    useEffect(() => {
      const loadRooms = async () => {
        try {
          const response = await fetchRooms(); // 서버 요청 함수 호출
          console.log(response);
          setRooms(response.data); // 서버에서 받아온 방 데이터를 상태에 설정
        } catch (error) {
          console.error("방 목록을 불러오는 중 오류가 발생했습니다:", error);
        }
      };
  
      loadRooms();
    }, []);

    //rooms 확인용
    useEffect(() => {
      console.log("rooms 상태 변경:", rooms);
    }, [rooms]); // rooms가 변경될 때마다 실행
    

  return (
    <RoomsContext.Provider value={{ rooms, addRoom }}>
      {children}
    </RoomsContext.Provider>
  );
};

RoomsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useRooms = () => {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error("useRooms must be used within a RoomsProvider");
  }
  return context;
};
