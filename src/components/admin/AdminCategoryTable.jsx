import { useEffect, useState, useCallback } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import Loading from "../Loading";

const CategoryTable = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ _id: null, name: "", description: "" });
  const [errors, setErrors] = useState({}); // For form validation errors
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCategories(token);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (_id) => {
    await deleteCategory(_id, token);
    fetchCategories();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name || form.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!form.description) {
      newErrors.description = "Description is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Only submit if form is valid

    try {
      if (form._id) {
        // Update category if form.id exists
        await updateCategory(
          form._id,
          { name: form.name, description: form.description },
          token
        );
      } else {
        // Create a new category if form.id doesn't exist
        await createCategory(
          { name: form.name, description: form.description },
          token
        );
      }
      setIsModalOpen(false);
      setForm({ _id: null, name: "", description: "" });
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Handle error message from backend (e.g. unique constraint error)
        setErrors({ backend: error.response.data.message });
      }
    }
  };

  const handleEdit = (category) => {
    // Set the form to the category details for editing
    setForm(category);
    setErrors({}); // Clear previous errors
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex mb-4">
        <button
          onClick={() => {
            setForm({ _id: null, name: "", description: "" });
            setErrors({}); // Clear previous errors
            setIsModalOpen(true);
          }}
          className="btn btn-primary"
        >
          Add Category
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
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning mr-2"
                      onClick={() => handleEdit(category)} // Use handleEdit for editing
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(category._id)}
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

      {/* Dialog Modal */}
      <dialog
        id="my_modal_3"
        className={`modal ${isModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box relative">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
          </form>
          <h2 className="text-xl font-bold mb-4">
            {form._id ? "Edit Category" : "Add Category"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                className={`input input-bordered w-full ${
                  errors.name ? "input-error" : ""
                }`}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <input
                type="text"
                className={`input input-bordered w-full ${
                  errors.description ? "input-error" : ""
                }`}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
            {errors.backend && (
              <p className="text-sm text-red-500 mb-4">{errors.backend}</p>
            )}
            <div className="flex justify-end space-x-2">
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

export default CategoryTable;
