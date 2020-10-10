import React, { useState } from 'react';

const UserContext = React.createContext(false);

export const UserProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  return (
    <UserContext.Provider value={[isSignedIn, setIsSignedIn]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
