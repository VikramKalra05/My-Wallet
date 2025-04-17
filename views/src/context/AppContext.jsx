import { createContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [addRecords, setAddRecords] = useState(false);
  const [records, setRecords] = useState([]);
  // const [editRecord ,setEditRecord]=useState(null)

  return (
    <AppContext.Provider
      value={{ addRecords, setAddRecords, records, setRecords }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
