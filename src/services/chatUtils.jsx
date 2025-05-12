const LOCAL_CHAT_KEY = "chatMessages";

export function getChatMessages(senderId, receiverId) {
  const allMessages = JSON.parse(localStorage.getItem(LOCAL_CHAT_KEY)) || [];
  return allMessages.filter(
    (msg) =>
      (msg.senderId === senderId && msg.receiverId === receiverId) ||
      (msg.senderId === receiverId && msg.receiverId === senderId)
  );
}

export function sendMessage(senderId, receiverId, text) {
  const newMessage = {
    senderId,
    receiverId,
    text,
    timestamp: new Date().toISOString(),
  };

  const messages = JSON.parse(localStorage.getItem(LOCAL_CHAT_KEY)) || [];
  const updated = [...messages, newMessage];
  localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify(updated));
  return newMessage;
}
