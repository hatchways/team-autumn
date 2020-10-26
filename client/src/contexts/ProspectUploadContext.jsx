import React, { useState } from 'react';

const ProspectUploadContext = React.createContext();

export const ProspectUploadProvider = ({ children }) => {
  const [message, setMessage] = useState({ type: '', text: '' });
  return (
    <ProspectUploadContext.Provider value={[message, setMessage]}>
      {children}
    </ProspectUploadContext.Provider>
  );
};

export default ProspectUploadContext;
