import api from "./api";

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data.products; 
};

export const getProductById = async (_id) => {
  const res = await api.get(`/products/${_id}`);
  return res.data.product; 
};

export const createProduct = async (formData, token) => {
  const res = await api.post("/products", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateProduct = async (_id, formData, token) => {
  const res = await api.put(`/products/${_id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteProduct = async (_id, token) => {
  const res = await api.delete(`/products/${_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
