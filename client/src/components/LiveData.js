import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const LiveData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on('newData', (newData) => {
      setData((prevData) => [...prevData, newData]);
    });

    return () => {
      socket.off('newData');
    };
  }, []);

  return (
    <div>
      <h2>Live Data Feed</h2>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{`${item.timestamp}: ${item.data}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default LiveData;
