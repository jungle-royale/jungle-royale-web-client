import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);

  const addRoom = (newRoom) => {
    if (!newRoom.title) {
      log.error("방 이름이 누락되었습니다:", newRoom);
      return;
    }

    setRooms((prevRooms) => [...prevRooms, newRoom]);
  };

  return (
    <RoomsContext.Provider value={{ rooms, setRooms, addRoom }}>
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
