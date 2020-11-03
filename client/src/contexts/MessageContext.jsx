import React, { useState } from 'react';

const MessageContext = React.createContext();

export const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState({ type: '', text: '' });
  return (
    <MessageContext.Provider value={[message, setMessage]}>{children}</MessageContext.Provider>
  );
};

export default MessageContext;
