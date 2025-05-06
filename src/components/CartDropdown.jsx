import React, { useState, useEffect } from "react";
import {
  getCartItems,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../services/cartService";
import { createOrder } from "../services/OrderService";

function CartDropdown() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const handleIncreaseQuantity = (itemId) => {
    const updatedItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCartItem(updatedItems);
    setCartItems(updatedItems);
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedItems = cartItems.map((item) =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCartItem(updatedItems);
    setCartItems(updatedItems);
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = cartItems.filter((item) => item.id !== itemId);
    removeFromCart(updatedItems);
    setCartItems(updatedItems);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const orderData = {
        products: cartItems,
        totalPrice: cartItems.reduce(
          (acc, item) => acc + item.quantity * item.price,
          0
        ),
      };
      const token = "user-token-here"; // Replace with actual token handling
      await createOrder(orderData, token);
      clearCart(); // Clear cart after successful order
      alert("Order placed successfully!");
      setCartItems([]);
    } catch (error) {
      alert("Failed to place the order. Please try again.");
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="badge badge-sm indicator-item">
            {cartItems.length}
          </span>
        </div>
      </div>
      <ul
        tabIndex={0}
        className="mt-3 z-[1] p-3 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64"
      >
        {cartItems.map((item) => (
          <li key={item.id}>
            <div className="flex justify-between items-center">
              <span>
                {item.name} x{item.quantity}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDecreaseQuantity(item.id)}
                  className="btn btn-xs"
                >
                  -
                </button>
                <button
                  onClick={() => handleIncreaseQuantity(item.id)}
                  className="btn btn-xs"
                >
                  +
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="btn btn-xs btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
        <div className="divider my-2"></div>
        <li>
          <button onClick={handlePlaceOrder} className="btn btn-primary w-full">
            Place Order
          </button>
        </li>
      </ul>
    </div>
  );
}

export default CartDropdown;
