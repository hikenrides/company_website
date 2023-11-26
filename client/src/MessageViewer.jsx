import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MessageViewer = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Include the authentication token in the headers
        const token = localStorage.getItem('token'); // Make sure to adjust this based on how you store the token
        const response = await axios.get(`/messages/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [receiverId]);

  return (
    <div>
      <h2>Messages for Receiver</h2>
      <ul>
        {messages.map((message) => (
          <li key={message._id}>
            <strong>Sender:</strong> {message.sender}
            <br />
            <strong>Content:</strong> {message.content}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageViewer;
