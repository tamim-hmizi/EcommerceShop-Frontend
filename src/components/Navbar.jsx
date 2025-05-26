import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import CartDropdown from "./CartDropdown";
import { useState, useEffect } from "react";
import {
  FiUser,
  FiLogOut,
  FiShoppingBag,
  FiHome,
  FiMail,
  FiMenu,
  FiX,
  FiShoppingCart,
  FiHeart,
} from "react-icons/fi";

function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if the current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when changing routes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/signin");
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-md"
          : "bg-white/90 border-gray-100 shadow-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <FiShoppingCart className="w-7 h-7 text-primary mr-2 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {user ? "!" : "0"}
              </span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transition-all duration-300 group-hover:from-secondary group-hover:to-primary">
              LuxeCart
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[
              { path: "/", label: "Home", icon: <FiHome className="w-4 h-4" /> },
              { path: "/product", label: "Products", icon: <FiShoppingBag className="w-4 h-4" /> },
              { path: "/contact", label: "Contact", icon: <FiMail className="w-4 h-4" /> }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors relative group flex items-center gap-1.5 py-1 ${
                  isActive(item.path)
                    ? "text-primary"
                    : "text-gray-600 hover:text-primary"
                }`}
              >
                {item.icon}
                {item.label}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isActive(item.path) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user && <CartDropdown />}

            {user ? (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="avatar">
                    <div className="w-9 rounded-full ring-2 ring-primary/20 ring-offset-2 shadow-sm overflow-hidden">
                      <img
                        src={
                          user.avatar ||
                          "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name) + "&background=4f46e5&color=fff"
                        }
                        alt={user.name}
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className="hidden md:inline text-sm font-medium">
                    {user.name}
                  </span>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-lg w-56 border border-gray-100 mt-2 animate-slideInUp"
                >
                  <li>
                    <Link to="/profile" className="text-sm hover:bg-gray-50">
                      <FiUser className="w-4 h-4" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" className="text-sm hover:bg-gray-50">
                      <FiHeart className="w-4 h-4" />
                      My Favorites
                    </Link>
                  </li>
                  <li>
                    <Link to="/my-orders" className="text-sm hover:bg-gray-50">
                      <FiShoppingBag className="w-4 h-4" />
                      My Orders
                    </Link>
                  </li>
                  <li className="border-t mt-1 pt-1">
                    <button onClick={handleLogout} className="text-sm text-red-500 hover:bg-red-50">
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to="/signin"
                className="btn btn-primary btn-sm md:btn-md rounded-full px-5 gap-2 shadow-sm hover:shadow transition-all"
              >
                <FiUser className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-circle md:hidden"
            >
              {mobileMenuOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t border-gray-100 animate-fadeIn">
            <nav className="flex flex-col space-y-2">
              {[
                { path: "/", label: "Home", icon: <FiHome className="w-4 h-4" /> },
                { path: "/product", label: "Products", icon: <FiShoppingBag className="w-4 h-4" /> },
                { path: "/contact", label: "Contact", icon: <FiMail className="w-4 h-4" /> },
                ...(user ? [
                  { path: "/favorites", label: "My Favorites", icon: <FiHeart className="w-4 h-4" /> },
                  { path: "/my-orders", label: "My Orders", icon: <FiShoppingBag className="w-4 h-4" /> },
                  { path: "/profile", label: "Profile", icon: <FiUser className="w-4 h-4" /> }
                ] : [])
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 p-2 rounded-md ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
