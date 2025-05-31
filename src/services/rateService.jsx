import axios from "axios";

const BASE_URL = "http://localhost:8081/api/v1/rate";

export const addOrUpdateRate = async (rateRequest) => {
  const response = await axios.post(BASE_URL, rateRequest);
  return response.data;
};

export const getAverageRate = async (ownerId) => {
  const response = await axios.get(`${BASE_URL}/average/${ownerId}`);
  return response.data;
};

export async function getUserRateForOwner(senderId, ownerId) {
  if (!senderId || !ownerId) return null;

  try {
    const response = await axios.get(`/api/v1/rate/${senderId}/${ownerId}`);
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania oceny", error);
    return null;
  }
}
