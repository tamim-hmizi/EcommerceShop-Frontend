import api from "./api";

export const getCategories = async () => {
  const res = await api.get("/category");
  return res.data;
};

export const getCategory = async (_id) => {
  const res = await api.get(`/category/${_id}`);
  return res.data;
};

export const createCategory = async (data, token) => {
  const res = await api.post("/category", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateCategory = async (_id, data, token) => {
  const res = await api.put(`/category/${_id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteCategory = async (_id, token) => {
  const res = await api.delete(`/category/${_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
