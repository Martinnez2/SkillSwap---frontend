import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../../styles/UserChat.css";
import { getUserById } from "../../services/userService";
import { getChatMessages, sendMessage } from "../../services/chatUtils";

const UserChat = () => {
  const { userId } = useParams();
  const [loggedUserDetails, setLoggedUserDetails] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [loggedUserRaw, setLoggedUserRaw] = useState(null);
  const isNameSet = loggedUserDetails?.name && loggedUserDetails?.surname;

  useEffect(() => {
    const fetchLoggedInUserDetails = async () => {
      const rawUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setLoggedUserRaw(rawUser);
      if (!rawUser) return;

      try {
        const userDetails = await getUserById(rawUser.id);
        setLoggedUserDetails(userDetails);
      } catch (err) {
        console.error(
          "Błąd podczas pobierania danych zalogowanego użytkownika:",
          err
        );
      }
    };

    fetchLoggedInUserDetails();
  }, []);

  useEffect(() => {
    const fetchRecipient = async () => {
      try {
        const userToLoad = await getUserById(Number(userId));
        if (!userToLoad) {
          console.error(`Nie znaleziono użytkownika o ID ${userId}`);
          setRecipient(null);
          return;
        }
        setRecipient(userToLoad);
        // console.log("Pobrany użytkownik:", userToLoad);
      } catch (error) {
        console.error("Błąd podczas pobierania użytkownika:", error);
        setRecipient(null);
      }
    };

    fetchRecipient();
  }, [userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (loggedUserDetails && recipient) {
        try {
          const relevantMessages = await getChatMessages(
            loggedUserDetails.userId,
            recipient.userId
          );
          setMessages(relevantMessages);
        } catch (err) {
          console.error("Błąd podczas pobierania wiadomości:", err);
        }
      }
    };
    fetchMessages();
  }, [loggedUserDetails, recipient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (loggedUserDetails && recipient) {
      // console.log("ID osoby odwiedzającej czat:", loggedUserDetails.userId);
      // console.log("ID odbiorcy wiadomości:", recipient.userId);
    }
  }, [loggedUserDetails, recipient]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await sendMessage(
        loggedUserDetails.userId,
        recipient.userId,
        newMessage
      );
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    }
  };

  if (loggedUserRaw?.status?.toUpperCase() === "BANNED") {
    return (
      <div className="block-message">
        Twoje konto jest zablokowane. Nie możesz korzystać z czatu.
      </div>
    );
  }

  if (!recipient) {
    return <p>Nie znaleziono użytkownika do rozmowy.</p>;
  }

  // console.log("recipient:", recipient);
  // console.log("loggeduser:", loggedUserDetails);

  return (
    <div className="chat-container">
      <h2>
        Czat z {recipient.name} {recipient.surname}
      </h2>

      <div className="message-list">
        {messages.map((msg) => {
          const senderId = msg.sender.userId || msg.sender.id;
          const isSender = senderId === loggedUserDetails.userId;
          return (
            <div
              key={msg.id || msg.timestamp}
              className={`message ${isSender ? "sender" : "receiver"}`}
            >
              <div className="bubble">
                <p>{msg.text}</p>
                <span className="timestamp">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {isNameSet ? (
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
      ) : (
        <div className="info-message">
          Aby korzystać z czatu, uzupełnij proszę brakujące dane na profilu.
        </div>
      )}
    </div>
  );
};

export default UserChat;
