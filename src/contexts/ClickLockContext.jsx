import { createContext, useContext, useState } from 'react';
import PropTypes from "prop-types";

const ClickLockContext = createContext();

export const ClickLockProvider = ({ children }) => {
  const [isLocked, setIsLocked] = useState(false);

  const lock = () => setIsLocked(true);
  const unlock = () => setIsLocked(false);

  return (
    <ClickLockContext.Provider value={{ isLocked, lock, unlock }}>
      {children}
    </ClickLockContext.Provider>
  );
};

ClickLockProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useClickLock = () => useContext(ClickLockContext);