// context/IsCollapsedContext.js
import React, { createContext, useContext, useState } from 'react';

type GlobalStateContextType = {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    isDarkMode: boolean;
    setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const GlobalStateContext = createContext<GlobalStateContextType>({
    isCollapsed: true,
    setIsCollapsed: () => {},
    isDarkMode: true,
    setIsDarkMode: () => {}
});

export const useGlabalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }:any) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <GlobalStateContext.Provider value={{ isCollapsed, setIsCollapsed, isDarkMode, setIsDarkMode }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
