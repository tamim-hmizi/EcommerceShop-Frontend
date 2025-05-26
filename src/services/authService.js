import api from "./api";

export const register = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export const updateProfile = async (userData, token) => {
  const res = await api.put("/users/profile", userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
