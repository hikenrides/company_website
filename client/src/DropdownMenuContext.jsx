import { createContext, useState } from "react";

const DropdownMenuContext = createContext({
    isOpen: false,
    setIsOpen: () => {},
  });
  
  function DropdownMenuProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
  
    const handleCloseMenu = () => {
      setIsOpen(false);
    };
  
    return (
      <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
        {children}
        <div onClick={handleCloseMenu} className="click-outside-listener"></div>
      </DropdownMenuContext.Provider>
    );
  }
  
  export { DropdownMenuContext, DropdownMenuProvider };