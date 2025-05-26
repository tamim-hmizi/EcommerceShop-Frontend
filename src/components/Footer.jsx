import { Link } from "react-router-dom";
import { FiShoppingCart, FiMail, FiPhone, FiMapPin, FiCreditCard, FiTruck, FiShield, FiHeart } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPinterest } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <FiShoppingCart className="w-6 h-6 text-primary mr-2" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                LuxeCart
              </span>
            </div>
            <p className="mb-4 text-gray-400">
              Your one-stop destination for premium products at competitive prices.
              We're committed to providing an exceptional shopping experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaYoutube className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <FaPinterest className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/product" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                  My Favorites
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-gray-400">
                  123 Commerce Street, Shopping District, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-primary" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-primary" />
                <span className="text-gray-400">support@luxecart.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest products, offers, and updates.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-300"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Features Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <FiTruck className="w-8 h-8 text-primary mb-2" />
              <h4 className="text-white font-medium">Free Shipping</h4>
              <p className="text-gray-400 text-sm">On orders over $50</p>
            </div>
            <div className="flex flex-col items-center">
              <FiCreditCard className="w-8 h-8 text-primary mb-2" />
              <h4 className="text-white font-medium">Secure Payment</h4>
              <p className="text-gray-400 text-sm">100% secure payment</p>
            </div>
            <div className="flex flex-col items-center">
              <FiShield className="w-8 h-8 text-primary mb-2" />
              <h4 className="text-white font-medium">Quality Guarantee</h4>
              <p className="text-gray-400 text-sm">30-day money back</p>
            </div>
            <div className="flex flex-col items-center">
              <FiHeart className="w-8 h-8 text-primary mb-2" />
              <h4 className="text-white font-medium">24/7 Support</h4>
              <p className="text-gray-400 text-sm">Dedicated support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-950 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} LuxeCart. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
