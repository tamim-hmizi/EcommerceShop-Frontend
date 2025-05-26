import { useState, useRef, useEffect } from "react";
import { register } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthIllustration from "./AuthIllustration";
import "../../styles/auth.css";
import { FiMail, FiLock, FiUser, FiUserPlus, FiCheckCircle } from "react-icons/fi";

function RegisterForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    name: { valid: null, touched: false },
    email: { valid: null, touched: false },
    password: { valid: null, touched: false },
    confirmPassword: { valid: null, touched: false }
  });

  const formRef = useRef(null);

  // Removed 3D tilt effect

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setFormState(prev => ({
      ...prev,
      name: {
        valid: value.length >= 2,
        touched: true
      }
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setFormState(prev => ({
      ...prev,
      email: {
        valid: value ? validateEmail(value) : null,
        touched: true
      }
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    const isValid = value.length >= 8;

    setFormState(prev => ({
      ...prev,
      password: {
        valid: isValid,
        touched: true
      },
      confirmPassword: {
        ...prev.confirmPassword,
        valid: confirmPassword ? confirmPassword === value && isValid : null
      }
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setFormState(prev => ({
      ...prev,
      confirmPassword: {
        valid: value === password && password.length >= 8,
        touched: true
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await register({ name, email, password });
      if (!response.success) {
        setError(response.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Show success animation before redirecting
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } catch (err) {
      setError(err.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left side - Illustration */}
      <div className="hidden md:block bg-gradient-to-br from-green-50 to-indigo-50 rounded-lg overflow-hidden shadow-lg">
        <div className="h-full flex items-center justify-center p-6">
          <AuthIllustration type="register" />
        </div>
      </div>

      {/* Right side - Form */}
      <div
        ref={formRef}
        className="auth-form-container p-8 md:p-10"
      >
        <div className="auth-decoration auth-decoration-1"></div>
        <div className="auth-decoration auth-decoration-2"></div>

        <h2 className="auth-title text-3xl font-bold text-center mb-8">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="alert alert-error mb-4 animate-[error-shake_0.5s_ease-in-out]">
              {error}
            </div>
          )}

          <div className="auth-input-group">
            <label htmlFor="name" className="auth-label flex items-center gap-2">
              <FiUser className="text-primary" />
              <span>Full Name</span>
            </label>
            <div className="relative">
              <input
                id="name"
                type="text"
                className={`auth-input ${
                  formState.name.touched
                    ? formState.name.valid
                      ? 'auth-input-success'
                      : formState.name.valid === false
                        ? 'auth-input-error'
                        : ''
                    : ''
                }`}
                value={name}
                onChange={handleNameChange}
                placeholder="John Doe"
              />
              {formState.name.touched && formState.name.valid === false && (
                <p className="text-xs text-red-500 mt-1">Name must be at least 2 characters</p>
              )}
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label flex items-center gap-2">
              <FiMail className="text-primary" />
              <span>Email Address</span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                className={`auth-input ${
                  formState.email.touched
                    ? formState.email.valid
                      ? 'auth-input-success'
                      : formState.email.valid === false
                        ? 'auth-input-error'
                        : ''
                    : ''
                }`}
                value={email}
                onChange={handleEmailChange}
                placeholder="your@email.com"
              />
              {formState.email.touched && formState.email.valid === false && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid email address</p>
              )}
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="password" className="auth-label flex items-center gap-2">
              <FiLock className="text-primary" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                className={`auth-input ${
                  formState.password.touched
                    ? formState.password.valid
                      ? 'auth-input-success'
                      : formState.password.valid === false
                        ? 'auth-input-error'
                        : ''
                    : ''
                }`}
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
              />
              {formState.password.touched && formState.password.valid === false && (
                <p className="text-xs text-red-500 mt-1">Password must be at least 8 characters</p>
              )}
            </div>
          </div>

          <div className="auth-input-group">
            <label htmlFor="confirmPassword" className="auth-label flex items-center gap-2">
              <FiCheckCircle className="text-primary" />
              <span>Confirm Password</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                className={`auth-input ${
                  formState.confirmPassword.touched
                    ? formState.confirmPassword.valid
                      ? 'auth-input-success'
                      : formState.confirmPassword.valid === false
                        ? 'auth-input-error'
                        : ''
                    : ''
                }`}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="••••••••"
              />
              {formState.confirmPassword.touched && formState.confirmPassword.valid === false && (
                <p className="text-xs text-red-500 mt-1">Passwords must match</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-primary hover:text-primary-dark">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-dark">Privacy Policy</a>
            </label>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FiUserPlus className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </span>
          </button>
        </form>

        <div className="auth-divider">Or</div>

        <div className="text-center">
          <p className="mb-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary font-bold hover:text-primary-dark transition-colors">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
