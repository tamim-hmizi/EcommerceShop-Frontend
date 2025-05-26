import { useEffect, useState, useRef } from "react";
import { getUserOrders } from "../services/OrderService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiAlertCircle,
  FiDollarSign,
  FiShoppingBag,
  FiCalendar,
  FiMapPin,
  FiShoppingCart
} from "react-icons/fi";

function MyOrders() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageURLs, setImageURLs] = useState({});
  const fetchedImages = useRef(new Set()); // prevent multiple requests
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getUserOrders();
        const rawOrders = res.data?.data || res.data || [];
        setOrders(rawOrders);

        // Deduplicate image fetching
        const fetchImages = async () => {
          const uniqueEntries = new Map();

          rawOrders.forEach(order => {
            order.orderItems?.forEach(item => {
              const id = item.product?._id;
              const imagePath = item.product?.image;
              if (id && imagePath && !uniqueEntries.has(id)) {
                uniqueEntries.set(id, imagePath);
              }
            });
          });

          for (const [id, imagePath] of uniqueEntries.entries()) {
            if (fetchedImages.current.has(id)) continue; // already fetched
            fetchedImages.current.add(id);

            try {
              const fullPath = imagePath.startsWith("http")
                ? imagePath
                : `${import.meta.env.VITE_API_URL}${imagePath}`;
              const res = await api.get(fullPath, { responseType: "blob" });
              const blobUrl = URL.createObjectURL(res.data);
              setImageURLs(prev => ({ ...prev, [id]: blobUrl }));
            } catch (err) {
              console.warn(`Failed to fetch image for ${id}`, err);
            }
          }
        };

        fetchImages();
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      Object.values(imageURLs).forEach(url => URL.revokeObjectURL(url));
    };
  }, [user, imageURLs]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return <FiClock className="text-yellow-500" />;
      case "Shipped": return <FiTruck className="text-blue-500" />;
      case "Delivered": return <FiCheckCircle className="text-green-500" />;
      default: return <FiAlertCircle className="text-red-500" />;
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-20 h-20 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
            <div className="w-20 h-20 border-t-4 border-indigo-300 rounded-full animate-ping absolute inset-0 opacity-30"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading your orders...</p>
          <p className="text-gray-500 mt-2">Please wait while we fetch your order history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Modern Header with Glassmorphism Effect */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl shadow-xl mb-10 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/20"></div>
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-white/20"></div>
          <div className="absolute right-1/4 bottom-1/3 w-36 h-36 rounded-full bg-white/20"></div>
        </div>

        {/* Content */}
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">My Orders</h2>
              <p className="text-indigo-100">Track and manage your purchase history</p>
            </div>
            <div className="flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl">
              <FiShoppingBag className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-indigo-500 transform transition-transform hover:scale-105 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-xl">
              <FiPackage className="h-7 w-7 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-green-500 transform transition-transform hover:scale-105 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {orders.filter(order => order.status === "Delivered").length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <FiCheckCircle className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500 transform transition-transform hover:scale-105 duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${orders.reduce((sum, order) => sum + order.totalPrice, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-xl">
              <FiDollarSign className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
          <div className="relative mx-auto mb-8">
            {/* Animated illustration */}
            <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
              <div className="absolute w-32 h-32 bg-indigo-100 rounded-full animate-ping opacity-50"></div>
              <FiPackage className="h-14 w-14 text-indigo-500 relative z-10" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-200 rounded-full"></div>
            <div className="absolute bottom-0 -left-4 w-8 h-8 bg-indigo-200 rounded-full"></div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
          <p className="text-gray-600 mb-8 max-w-xs mx-auto">Start shopping to build your order history and track your purchases</p>

          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full flex items-center justify-center gap-2 mx-auto shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <FiShoppingCart className="w-5 h-5" />
            <span>Discover Products</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              {/* Order Header with Gradient Accent */}
              <div className="relative">
                {/* Colored accent based on status */}
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  order.status === "Delivered" ? "bg-gradient-to-r from-green-400 to-green-600" :
                  order.status === "Shipped" ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                  order.status === "Processing" ? "bg-gradient-to-r from-yellow-400 to-yellow-600" :
                  "bg-gradient-to-r from-gray-400 to-gray-600"
                }`}></div>

                <div className="bg-gray-50 p-6 pt-7">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-900">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <div className={`badge ${
                          order.isPaid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        } text-xs font-medium px-2 py-1 rounded-full`}>
                          {order.isPaid ? "Paid" : "Payment Pending"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <FiCalendar className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-sm ${
                      order.status === "Delivered" ? "bg-green-50 text-green-700 border border-green-200" :
                      order.status === "Shipped" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      order.status === "Processing" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" :
                      "bg-gray-50 text-gray-700 border border-gray-200"
                    }`}>
                      {getStatusIcon(order.status)}
                      <span className="font-medium">{order.status}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FiShoppingBag className="w-4 h-4" />
                  <span>Order Items</span>
                  <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                  </span>
                </h4>

                <div className="space-y-4">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200 border border-gray-100 hover:border-gray-200">
                      {/* Product Image with Shadow and Hover Effect */}
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 group-hover:shadow-md transition-all duration-200">
                        {imageURLs[item.product?._id] ? (
                          <img
                            src={imageURLs[item.product._id]}
                            alt={item.product?.name || "Product"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400 p-2">
                            <FiShoppingCart className="w-8 h-8 mb-1 text-indigo-400" />
                            <div className="text-xs font-medium text-center text-gray-500 line-clamp-1 w-full">
                              {item.product?.name || "Product"}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product Details with Better Typography */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors duration-200">
                          {item.product?.name || "Unnamed Product"}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            Qty: {item.quantity}
                          </span>
                          <span className="text-sm text-gray-500">
                            ${(item.product?.price || 0).toFixed(2)} per unit
                          </span>
                        </div>
                      </div>

                      {/* Price with Highlight */}
                      <div className="font-bold text-gray-900 bg-indigo-50 px-3 py-1.5 rounded-lg">
                        ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-6 border-t border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-6">
                    {/* Order Summary */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Items</p>
                      <p className="font-medium text-gray-900 mt-1">
                        {order.orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>

                    <div className="h-10 border-l border-gray-200"></div>

                    {/* Shipping Address */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Shipping Address</p>
                      <p className="font-medium text-gray-900 flex items-center gap-1 mt-1">
                        <FiMapPin className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">
                          {order.shippingAddress?.address || "No address provided"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="bg-indigo-50 px-6 py-3 rounded-lg shadow-sm">
                    <p className="text-xs text-indigo-700 uppercase tracking-wider font-medium">Total Amount</p>
                    <p className="text-2xl font-bold text-indigo-700 mt-1">
                      ${order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
