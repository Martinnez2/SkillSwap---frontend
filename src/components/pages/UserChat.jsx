import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../../styles/UserChat.css";
import { getUserById } from "../../services/userService";
import { getChatMessages, sendMessage } from "../../services/chatUtils";

const LOCAL_CHAT_KEY = "chatMessages";

const UserChat = () => {
  const { userId } = useParams();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const recipient = getUserById(Number(userId));
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (loggedInUser && recipient) {
      const relevantMessages = getChatMessages(loggedInUser.id, recipient.id);
      setMessages((prevMessages) => {
        if (JSON.stringify(prevMessages) !== JSON.stringify(relevantMessages)) {
          return relevantMessages;
        }
        return prevMessages;
      });
    }
  }, [loggedInUser, recipient]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = sendMessage(loggedInUser.id, recipient.id, newMessage);
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  if (!recipient) {
    return <p>Nie znaleziono użytkownika do rozmowy.</p>;
  }

  return (
    <div className="chat-container">
      <h2>
        Czat z {recipient.name} {recipient.surname}
      </h2>
      <div className="message-list">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderId === loggedInUser.id ? "sender" : "receiver"
            }`}
          >
            <div className="bubble">
              <p>{msg.text}</p>
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          style={{ backgroundColor: "rgb(157, 157, 157)" }}
        />
        <button type="submit">Wyślij</button>
      </form>
    </div>
  );
};

export default UserChat;
