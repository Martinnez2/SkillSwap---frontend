import axios from "axios";

const API_BASE = "/api/v1/chat";

export async function getChatMessages(senderId, receiverId) {
  try {
    const response = await axios.get(`${API_BASE}/messages`, {
      params: { senderId, receiverId },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania wiadomości:", error);
    throw error;
  }
}

export async function sendMessage(senderId, receiverId, text) {
  try {
    const newMessage = {
      senderId,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
    };

    const response = await axios.post(`${API_BASE}/messages`, newMessage, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Błąd podczas wysyłania wiadomości:", error);
    throw error;
  }
}
