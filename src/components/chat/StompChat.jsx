import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import log from 'loglevel';

// const MAX_SCORE = 5;
// const SCORE_DECREASE_INTERVAL = 3000;
// const SCORE_AMOUNT = 1;


const StompChat = ({ nickname }) => {
  const SERVER_URL = import.meta.env.VITE_WS_SERVER;

  const [wsClient, setWsClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(''); 
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const messagesEndRef = useRef(null);
  const chatMessagesRef = useRef(null);
  const isUserAtBottomRef = useRef(true); 

  useEffect(() => {
    const client = new WebSocket(SERVER_URL);

    client.onopen = () => {
      log.info('WebSocket connection established');
      setWsClient(client);
    };

    client.onmessage = (event) => {
      const { content, sender, id } = JSON.parse(event.data);

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === id)) return prev;
        return [...prev, { content, sender, id }];
      });

      if (!isUserAtBottomRef.current) {
        setNewMessagesCount((prevCount) => prevCount + 1);
      }
    };

    client.onerror = (error) => {
      log.error('WebSocket error:', error);
    };

    client.onclose = () => {
      log.info('WebSocket connection closed');
      setWsClient(null);
    };

    return () => {
      client.close();
    };
  }, []);

  useLayoutEffect(() => {
    if (isUserAtBottomRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  const isAtBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
    return Math.abs(scrollTop + clientHeight - scrollHeight) < 1;
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setNewMessagesCount(0);
    isUserAtBottomRef.current = true; // Ref 업데이트
  };

  const handleScroll = () => {
    if (isAtBottom()) {
      isUserAtBottomRef.current = true; // Ref 업데이트
      setNewMessagesCount(0); // 리렌더링 최소화
    } else {
      isUserAtBottomRef.current = false; // Ref 업데이트
    }
  };

  const sendMessage = () => {
    if (wsClient && message.trim()) {
      const newMessage = { content: message, sender: nickname, id: Date.now() };
      wsClient.send(JSON.stringify(newMessage));
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if(e.nativeEvent.isComposing){
        return;
      }
      if (message.trim()) {
        sendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[500px] w-full bg-gray-100 border rounded-lg shadow-md">
      <div
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-white border-b"
        ref={chatMessagesRef}
        onScroll={handleScroll}
      >
        {messages.map((msg, index) => (
          <p
            key={index}
            className={`p-2 rounded-lg text-sm ${
              msg.sender === nickname
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {!isUserAtBottomRef.current && newMessagesCount > 0 && (
        <div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-sm py-1 px-3 rounded-full cursor-pointer shadow-md"
          onClick={scrollToBottom}
        >
          새 메시지 {newMessagesCount}개
        </div>
      )}
      <div className="flex items-center p-2 bg-gray-200">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

StompChat.propTypes = {
  nickname: PropTypes.string.isRequired,
};

export default StompChat;
