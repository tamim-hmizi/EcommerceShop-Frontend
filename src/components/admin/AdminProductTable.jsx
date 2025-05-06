import { useEffect, useState, useCallback, useRef } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/ProductService";
import { getCategories } from "../../services/categoryService";
import Loading from "../Loading";
import api from "../../services/api";

const AdminProductTable = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageURLs, setImageURLs] = useState({});

  const [form, setForm] = useState({
    _id: null,
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  const dialogRef = useRef(null);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories(token);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [token]);

  const fetchImage = async (imagePath, productId) => {
    try {
      const response = await api.get(imagePath, { responseType: "blob" });
      const imageUrl = URL.createObjectURL(response.data);
      setImageURLs((prev) => ({ ...prev, [productId]: imageUrl }));
    } catch (error) {
      console.error(`Error fetching image for product ${productId}:`, error);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
      data.forEach((product) => {
        if (product.image) {
          fetchImage(product.image, product._id);
        }
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleDelete = async (_id) => {
    await deleteProduct(_id, token);
    fetchProducts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);

    if (form.image) {
      formData.append("image", form.image);
    }

    if (form._id) {
      await updateProduct(form._id, formData, token);
    } else {
      await createProduct(formData, token);
    }

    closeModal();
    setForm({
      _id: null,
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      image: null,
    });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      ...product,
      category: product.category?._id || "",
      image: null,
    });
    openModal();
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex mb-4">
        <button onClick={openModal} className="btn btn-primary">
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {imageURLs[product._id] ? (
                      <img
                        src={imageURLs[product._id]}
                        alt={product.name + " image"}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="flex justify-center items-center">
                        <Loading />
                      </div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    {product.category ? product.category.name : "No Category"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <dialog id="my_modal_3" className="modal" ref={dialogRef}>
        <div className="modal-box">
          <form method="dialog">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={closeModal}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">
            {form._id ? "Edit Product" : "Add Product"}
          </h3>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Price</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Stock</label>
              <input
                type="number"
                className="input input-bordered w-full"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Category</label>
              <select
                className="input input-bordered w-full"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Image</label>
              <input
                type="file"
                className="input input-bordered w-full"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                {form._id ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default AdminProductTable;
