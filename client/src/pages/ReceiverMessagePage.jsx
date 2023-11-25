import React, { useState, useEffect } from 'react';
import MessageViewer from '../MessageViewer';
import axios from 'axios';

const ReceiverMessagesPage = ({ place }) => {
  const [receiverMessages, setReceiverMessages] = useState([]);

  useEffect(() => {
    const fetchReceiverMessages = async () => {
      try {
        const response = await axios.get(`/messages/${place.owner}`);
        setReceiverMessages(response.data);
      } catch (error) {
        console.error('Error fetching receiver messages:', error);
      }
    };

    fetchReceiverMessages();
  }, [place.owner]);

  return (
    <div>
      <h1>Receiver Messages</h1>
      <MessageViewer messages={receiverMessages} />
    </div>
  );
};

export default ReceiverMessagesPage;
