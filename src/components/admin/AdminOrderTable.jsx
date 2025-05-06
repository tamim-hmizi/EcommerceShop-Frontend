import { useEffect, useState, useCallback } from "react";
import {
  getAllOrders,
  updateOrderStatusAndPayment,
} from "../../services/OrderService";
import Loading from "../Loading";

function AdminOrderTable({ token }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    _id: null,
    isPaid: false,
    status: "Pending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllOrders(token);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleEdit = (order) => {
    setForm({
      _id: order._id,
      isPaid: order.isPaid,
      status: order.status,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrderStatusAndPayment(
        form._id,
        { isPaid: form.isPaid, status: form.status },
        token
      );
      setIsModalOpen(false);
      setForm({ _id: null, isPaid: false, status: "Pending" });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      setErrors({ backend: error.response?.data?.message || "Update failed" });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">All Orders</h2>
      {loading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Paid</th>
                <th>Total</th>
                <th>Created At</th>
                <th>Items</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <div>
                      <p className="font-semibold">
                        {order.user?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.user?.email}
                      </p>
                    </div>
                  </td>
                  <td>{order.status || "Pending"}</td>
                  <td>{order.isPaid ? "Yes" : "No"}</td>
                  <td>${order.totalPrice?.toFixed(2) || "0.00"}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>
                    <ul className="space-y-2">
                      {order.orderItems?.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <img
                            src={item.product?.image}
                            alt={item.product?.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <p>{item.product?.name || "Product"}</p>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(order)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <dialog
        id="edit_order_modal"
        className={`modal ${isModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box relative">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
          </form>
          <h2 className="text-xl font-bold mb-4">Edit Order</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Is Paid</label>
              <select
                className="select select-bordered w-full"
                value={form.isPaid}
                onChange={(e) =>
                  setForm({ ...form, isPaid: e.target.value === "true" })
                }
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Order Status</label>
              <select
                className="select select-bordered w-full"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {errors.backend && (
              <p className="text-sm text-red-500 mb-4">{errors.backend}</p>
            )}
            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}

export default AdminOrderTable;
