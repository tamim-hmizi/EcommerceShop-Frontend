import { useSelector, useDispatch } from "react-redux";
import { createOrder } from "../services/OrderService";
import {
  clearCart,
  removeFromCart,
  removeServerCartItem,
  clearServerCart
} from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiX, FiArrowRight } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

function CartDropdown() {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);
  const [imageURLs, setImageURLs] = useState({});
  // Use ref to track image URLs without causing re-renders
  const imageURLsRef = useRef(imageURLs);

  // Update ref when imageURLs changes
  useEffect(() => {
    imageURLsRef.current = imageURLs;
  }, [imageURLs]);

  // Load images for cart items
  useEffect(() => {
    const fetchImages = async () => {
      if (items.length === 0) {
        setLoadingImages(false);
        return;
      }

      try {
        // Create a new object for image URLs to avoid dependency issues
        const newImageURLs = {};
        const currentImageURLs = imageURLsRef.current; // Use ref to avoid dependency issues

        // Process items one by one to avoid overwhelming the server
        for (const item of items) {
          // Skip if there's no image path or no item ID
          if (!item.image || !item._id) continue;

          // Skip if we already have this image cached
          if (currentImageURLs[item._id]) {
            newImageURLs[item._id] = currentImageURLs[item._id];
            continue;
          }

          try {
            // Handle both absolute and relative image paths
            let imagePath;
            if (item.image.startsWith('http')) {
              imagePath = item.image;
            } else if (item.image.startsWith('/uploads')) {
              // Backend serves uploads at /api/uploads, so construct the correct path
              imagePath = `${api.defaults.baseURL}${item.image}`;
            } else {
              // For relative paths, add the full API base URL
              imagePath = `${api.defaults.baseURL}${item.image}`;
            }

            console.log(`Fetching image for ${item.name} from:`, imagePath);

            // Use fetch instead of axios for better blob handling
            const response = await fetch(imagePath);
            if (!response.ok) {
              throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            newImageURLs[item._id] = blobUrl;
          } catch (error) {
            console.error(`Error fetching image for ${item.name} (${item._id}):`, error);
            // Use a fallback or placeholder instead of null
            newImageURLs[item._id] = null;
          }
        }

        // Only update if there are changes to avoid infinite loops
        const hasChanges = Object.keys(newImageURLs).some(
          key => !currentImageURLs[key] || currentImageURLs[key] !== newImageURLs[key]
        );

        if (hasChanges) {
          setImageURLs(newImageURLs);
        }

        setLoadingImages(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setLoadingImages(false);
      }
    };

    fetchImages();

    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      // Use the ref to get the latest imageURLs
      Object.values(imageURLsRef.current).forEach(url => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [items]); // Only depend on items to prevent infinite loops

  const handlePlaceOrder = async () => {
    if (!user?.token) {
      toast.info("Please log in to place an order.");
      navigate('/signin');
      return;
    }

    if (items.length === 0) {
      toast.info("Your cart is empty.");
      return;
    }

    setIsPlacingOrder(true);

    // Validate cart items before creating order
    const validItems = items.filter(item => {
      const isValid = item._id && typeof item._id === 'string' && item._id.length === 24;
      return isValid;
    });

    if (validItems.length === 0) {
      toast.error("No valid items in cart. Please try adding products again.");
      setIsPlacingOrder(false);
      return;
    }

    if (validItems.length !== items.length) {
      toast.warning(`${items.length - validItems.length} invalid items were removed from your order.`);
    }

    // Ensure all required fields are present and properly formatted
    const orderData = {
      orderItems: validItems.map(item => {
        // Ensure quantity is a number and at least 1
        const quantity = Math.max(
          1,
          typeof item.quantity === 'number'
            ? Math.floor(item.quantity) // Ensure it's an integer
            : parseInt(item.quantity, 10) || 1
        );

        return {
          product: item._id, // This should now always be valid
          quantity: quantity
        };
      }),
      shippingAddress: {
        address: "123 Main Street",
        city: "City",
        postalCode: "0000",
        country: "Tunisia",
      },
      // Ensure totalPrice is a number with 2 decimal places (positive number)
      totalPrice: Math.max(0.01, parseFloat(validItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2))),
    };

    try {
      const response = await createOrder(orderData);

      // If user is logged in, also clear server cart
      if (user) {
        try {
          await dispatch(clearServerCart()).unwrap();
        } catch (error) {
          console.error('Error clearing server cart:', error);
        }
      }

      // Clear local cart
      dispatch(clearCart());

      toast.success("Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      console.error("Order error:", err);

      // Check if it's a product ID validation error
      if (err.message && err.message.includes("missing product ID")) {
        toast.error("One or more items in your cart are invalid. Please try removing and adding them again.");
        console.error("Product ID validation error:", err.message);
      }
      // Check for specific error messages from the backend
      else if (err.response && err.response.data) {
        // Handle validation errors if they exist
        if (err.response.data.errors && err.response.data.errors.length > 0) {
          const errorMessages = err.response.data.errors.map(e => `${e.param}: ${e.msg}`).join(', ');
          toast.error(`Validation error: ${errorMessages}`);
        } else if (err.response.data.message) {
          // If the error is about insufficient stock
          if (err.response.data.message.includes("Insufficient stock")) {
            toast.error(err.response.data.message);
          } else {
            toast.error(err.response.data.message);
          }
        } else {
          toast.error("Failed to place order. Please try again.");
        }
      } else {
        toast.error(`Failed to place order: ${err.message || "Unknown error"}`);
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <FiShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="badge badge-sm badge-primary indicator-item">
              {totalItems}
            </span>
          )}
        </div>
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-[1] mt-3 p-4 shadow-lg bg-white rounded-xl w-80"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Your Cart</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => document.activeElement.blur()} // This will close the dropdown by removing focus
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <FiShoppingCart className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto space-y-4">
              {loadingImages && items.length > 0 ? (
                <div className="flex justify-center py-4">
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              ) : (
                items.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {imageURLs[item._id] ? (
                        <img
                          src={imageURLs[item._id]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error(`Error loading image for ${item.name}`);
                            e.target.onerror = null; // Prevent infinite error loop
                            e.target.style.display = 'none'; // Hide the broken image
                            e.target.parentNode.classList.add('flex', 'items-center', 'justify-center');
                            const fallback = document.createElement('div');
                            fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>';
                            e.target.parentNode.appendChild(fallback);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <FiShoppingCart className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={() => {
                          // Remove from local cart
                          dispatch(removeFromCart(item._id));

                          // If user is logged in, also remove from server cart
                          if (user) {
                            dispatch(removeServerCartItem(item._id))
                              .catch(error => {
                                console.error('Error removing item from server cart:', error);
                              });
                          }
                        }}
                        aria-label="Remove item"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-sm btn-ghost w-full mt-2 text-gray-500 hover:text-red-500"
                onClick={() => {
                  // Clear local cart
                  dispatch(clearCart());

                  // If user is logged in, also clear server cart
                  if (user) {
                    dispatch(clearServerCart())
                      .catch(error => {
                        console.error('Error clearing server cart:', error);
                      });
                  }
                }}
              >
                Clear Cart
              </button>
            </div>

            <button
              className="btn btn-primary w-full mt-4 gap-2"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  Checkout <FiArrowRight />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDropdown;