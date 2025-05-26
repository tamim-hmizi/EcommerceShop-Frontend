import { useEffect, useState } from "react";
import api from "../services/api";
import Loading from "../components/Loading";
import { FiShoppingCart, FiEye, FiHeart } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addItemToServerCart } from "../redux/slices/cartSlice";
import { toggleProductFavorite, checkProductFavorite } from "../redux/slices/favoriteSlice";
import { store } from "../redux/store";
import QuickViewModal from "./QuickViewModal";
import { toast } from "react-toastify";

// Rating Stars Component
const RatingStars = ({ rating = 4.5 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} className="text-amber-400" />);
  }

  // Add half star if needed
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" className="text-amber-400" />);
  }

  // Add empty stars
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} className="text-amber-400" />);
  }

  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="text-xs text-gray-500 ml-1">({Math.round(rating * 10) / 10})</span>
    </div>
  );
};

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { loading: favoriteLoading } = useSelector(state => state.favorites);

  const [imageUrl, setImageUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteAnimating, setFavoriteAnimating] = useState(false);

  // Load product image
  useEffect(() => {
    const fetchImage = async () => {
      if (product.image) {
        try {
          // Check if the image path is a full URL or a relative path
          if (product.image.startsWith('http')) {
            setImageUrl(product.image);
          } else {
            // Construct the full URL for the API endpoint
            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const imagePath = product.image.startsWith('/') ? product.image : `/${product.image}`;
            const fullUrl = `${baseUrl}${imagePath}`;

            const response = await api.get(fullUrl, {
              responseType: "blob",
            });
            const blobUrl = URL.createObjectURL(response.data);
            setImageUrl(blobUrl);
          }
        } catch (error) {
          console.error("Error fetching image:", error);
          // Set a fallback image if the product image fails to load
          setImageUrl(`https://via.placeholder.com/300?text=${encodeURIComponent(product.name)}`);
        } finally {
          setLoadingImage(false);
        }
      } else {
        // Set a placeholder image if no image is provided
        setImageUrl(`https://via.placeholder.com/300?text=${encodeURIComponent(product.name)}`);
        setLoadingImage(false);
      }
    };

    fetchImage();

    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl);
    };
  }, [product.image, product.name, imageUrl]);

  // Check if product is in favorites
  useEffect(() => {
    if (user) {
      const checkFavorite = async () => {
        try {
          const result = await dispatch(checkProductFavorite(product._id)).unwrap();
          setIsFavorite(result.isFavorite);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      };

      checkFavorite();
    }
  }, [dispatch, product._id, user]);

  // Add to cart with quantity
  const handleAddToCart = (qty = quantity) => {
    console.log("Adding to cart with image path:", product.image);

    // Check if product is out of stock
    if (product.stock <= 0) {
      toast.error(`Sorry, ${product.name} is out of stock!`, {
        position: "bottom-right",
      });
      return;
    }

    // Create the product object to add to cart
    const productToAdd = {
      ...product,
      quantity: qty
    };

    // Store the product with its original image path for persistence
    dispatch(addToCart(productToAdd));

    // Get the current state to check the success flag
    const cartState = store.getState().cart;
    const authState = store.getState().auth;

    // If user is logged in, also add to server cart
    if (authState.user) {
      dispatch(addItemToServerCart(productToAdd))
        .catch(error => {
          console.error('Error adding item to server cart:', error);
        });
    }

    // Check if we were able to add the full requested quantity
    if (!cartState.lastOperationSuccess) {
      toast.warning(`Only ${product.stock} units of ${product.name} are available. We've added the maximum available to your cart.`, {
        position: "bottom-right",
        autoClose: 5000
      });
    } else {
      // Show a toast notification that the item was added
      toast.success(`Added ${product.name} to cart!`, {
        position: "bottom-right",
        icon: "🛒"
      });
    }
  };

  const increment = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Handle toggling favorite status
  const handleToggleFavorite = async () => {
    if (!user) {
      toast.info("Please sign in to add items to your favorites");
      return;
    }

    setFavoriteAnimating(true);

    try {
      const result = await dispatch(toggleProductFavorite(product._id)).unwrap();
      setIsFavorite(result.isFavorite);

      if (result.isFavorite) {
        toast.success("Added to favorites");
      } else {
        toast.info("Removed from favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
      console.error("Error toggling favorite:", error);
    } finally {
      // Reset animation after a short delay
      setTimeout(() => {
        setFavoriteAnimating(false);
      }, 300);
    }
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden h-72">
          {loadingImage ? (
            <div className="flex justify-center items-center w-full h-full bg-gray-50">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-2"></div>
                <Loading />
              </div>
            </div>
          ) : (
            <>
              <img
                src={imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
              />

              {/* Discount tag if original price exists */}
              {product.originalPrice && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-1 px-3 rounded-bl-lg shadow-md transform rotate-0 origin-top-right">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </div>
              )}

              {/* Quick actions on hover */}
              <div className={`absolute inset-0 bg-black/5 backdrop-blur-[2px] flex items-center justify-center gap-4 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <button
                  className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-md transition-all hover:scale-110 hover:shadow-lg"
                  onClick={() => setShowQuickView(true)}
                  aria-label="Quick view"
                >
                  <FiEye className="w-5 h-5" />
                </button>
                <button
                  className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-md transition-all hover:scale-110 hover:shadow-lg"
                  onClick={() => handleAddToCart(1)}
                  aria-label="Add to cart"
                >
                  <FiShoppingCart className="w-5 h-5" />
                </button>
                <button
                  className={`${isFavorite ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-800'}
                    hover:bg-white p-3 rounded-full shadow-md transition-all hover:scale-110 hover:shadow-lg
                    ${favoriteAnimating ? 'animate-heartbeat' : ''}`}
                  onClick={handleToggleFavorite}
                  disabled={favoriteLoading}
                  aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {isFavorite ? (
                    <FaHeart className="w-5 h-5 text-red-500" />
                  ) : (
                    <FiHeart className="w-5 h-5" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Product Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.stock > 0 && product.stock < 5 && (
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Sold Out
            </span>
          )}
          {product.originalPrice && product.stock > 0 && (
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Category & Name */}
          <div className="mb-2">
            <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">{product.category?.name || 'Uncategorized'}</span>
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mt-1 group-hover:text-indigo-700 transition-colors">{product.name}</h3>
          </div>

          {/* Rating */}
          <div className="mb-3">
            <RatingStars rating={product.rating || 4.5} />
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden shadow-sm">
              <button
                onClick={decrement}
                className="text-sm font-bold px-3 py-1 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="px-3 font-medium">{quantity}</span>
              <button
                onClick={increment}
                className="text-sm font-bold px-3 py-1 hover:bg-gray-100 transition-colors"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <span className={`text-xs font-medium ${product.stock === 0 ? 'text-red-500' : product.stock < 5 ? 'text-amber-500' : 'text-gray-500'}`}>
              {product.stock === 0 ? 'Out of stock' : product.stock < 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
            </span>
          </div>

          {/* Price & Add Button */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              {product.originalPrice && (
                <span className="text-xs text-green-600 font-medium">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full shadow-sm transition-all duration-200 flex items-center gap-2 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleAddToCart(quantity)}
              disabled={product.stock === 0}
            >
              <FiShoppingCart className="w-4 h-4" />
              {product.stock === 0 ? 'Sold Out' : 'Add'}
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal
          product={product}
          imageUrl={imageUrl}
          onClose={() => setShowQuickView(false)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}

export default ProductCard;
