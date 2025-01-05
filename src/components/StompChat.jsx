import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import './StompChat.css'; // CSS 파일 불러오기

const StompChat = () => {
  const SERVER_URL = import.meta.env.VITE_WS_SERVER;

  const [wsClient, setWsClient] = useState(null);
  const [messages, setMessages] = useState([]); // 메시지 배열
  const [message, setMessage] = useState(''); // 입력 필드
  const [newMessagesCount, setNewMessagesCount] = useState(0); // 새 메시지 수
  const messagesEndRef = useRef(null); // 스크롤 참조
  const chatMessagesRef = useRef(null); // 메시지 영역 참조
  const [isUserAtBottom, setIsUserAtBottom] = useState(true); // 사용자가 맨 아래에 있는지 상태 관리

  useEffect(() => {
    const client = new WebSocket(SERVER_URL);

    client.onopen = () => {
      console.log('WebSocket connection established');
      setWsClient(client);
    };

    client.onmessage = (event) => {
      const { content, sender, id } = JSON.parse(event.data);

      setMessages((prev) => {
        // 중복 메시지 확인
        if (prev.some((msg) => msg.id === id)) return prev;
        return [...prev, { content, sender, id }];
      });

      // 사용자가 맨 아래에 있지 않을 경우 newMessagesCount 증가
      if (!isUserAtBottom) {
        setNewMessagesCount((prevCount) => prevCount + 1);
      }
    };

    client.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    client.onclose = () => {
      console.log('WebSocket connection closed');
      setWsClient(null);
    };

    return () => {
      client.close();
    };
  }, []);

  useLayoutEffect(() => {
    if (isUserAtBottom) {
      scrollToBottom();
    }
  }, [messages]);

  const isAtBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
    return Math.abs(scrollTop + clientHeight - scrollHeight) < 1; // 위치 오차 허용
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setNewMessagesCount(0);
    setIsUserAtBottom(true);
  };

  const handleScroll = () => {
    if (isAtBottom()) {
      setIsUserAtBottom(true);
      setNewMessagesCount(0); // 스크롤이 맨 아래로 이동하면 새 메시지 알림 초기화
    } else {
      setIsUserAtBottom(false);
    }
  };

  const sendMessage = () => {
    if (wsClient && message.trim()) {
      const newMessage = { content: message, sender: 'User', id: Date.now() };
      
      // 메시지를 WebSocket을 통해 전송
      wsClient.send(JSON.stringify(newMessage));
      // 메시지를 로컬 상태에 추가
      setMessages((prev) => [...prev, newMessage]);
      
      // 입력 필드 초기화
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages" ref={chatMessagesRef} onScroll={handleScroll}>
        {messages.map((msg, index) => (
          <p key={index} className={msg.sender === 'User' ? 'message-user' : 'message-other'}>
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
        <div ref={messagesEndRef} /> {/* 스크롤 참조용 div */}
      </div>
      {/* 새 메시지 알림 */}
      {!isUserAtBottom && newMessagesCount > 0 && (
        <div className="new-messages-alert" onClick={scrollToBottom}>
          새 메시지 {newMessagesCount}개
        </div>
      )}
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={!message.trim()}>Send</button>
      </div>
    </div>
  );
};

export default StompChat;
