import React, { useState } from 'react';

const ProspectsContext = React.createContext();

export const ProspectsProvider = ({ children }) => {
  const [search, setSearch] = useState('');
  return (
    <ProspectsContext.Provider value={[search, setSearch]}>{children}</ProspectsContext.Provider>
  );
};

export default ProspectsContext;
