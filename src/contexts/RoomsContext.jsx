import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";


const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);

  const addRoom = (newRoom) => {
    setRooms((prevRooms) => [...prevRooms, newRoom]);
  };

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
