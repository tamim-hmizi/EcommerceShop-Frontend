import api from "./api";

export const getUsers = async (token) => {
  const res = await api.get("/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getUser = async (_id, token) => {
  const res = await api.get(`/users/${_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateUser = async (_id, data, token) => {
  const res = await api.put(`/users/${_id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteUser = async (_id, token) => {
  const res = await api.delete(`/users/${_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
