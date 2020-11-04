import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
const SocketTest = () => {
  const [response, setResponse] = useState('');
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    const socket = socketIOClient('/');
    // socket.emit('connect');
    socket.on('connect', () => {
      setConnected(true);
      console.log("Connected");
      socket.emit("sent_email_status","FromClient");
    });
    socket.on('sent_email_status', (data) => {
      console.log(data);
      setResponse(data);
    });
    return () => {
      setConnected(false);
    };
  }, []);

  if (!connected) {
    return <div />;
  }

  return <div><h>{response}</h>{response && console.log(response)}</div>;
};

export default SocketTest;