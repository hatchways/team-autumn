import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

import LoadingSpinner from './LoadingSpinner';

const SocketTest = () => {
  const [response, setResponse] = useState('');
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const socket = socketIOClient('/');
    socket.on('connect', () => setConnected(true));
    socket.on('sent_email_status', (data) => {
      setResponse(data);
    });
    return () => {
      setConnected(false);
    };
  });

  if (!connected) {
    return <LoadingSpinner />;
  }

  return <div>{response && console.log(response)}</div>;
};

export default SocketTest;
