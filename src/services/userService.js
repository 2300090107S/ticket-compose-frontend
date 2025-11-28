import api from "./api";

const API_URL = "/users";

export const registerUser = async (userData) => {
  const response = await api.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`${API_URL}/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  await api.delete(`${API_URL}/${id}`);
};

export const getAllUsers = async () => {
  const response = await api.get(API_URL);
  return response.data;
};
