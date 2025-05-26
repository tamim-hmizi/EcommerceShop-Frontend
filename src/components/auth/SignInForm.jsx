import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetError } from "../../redux/slices/authSlice";
import { Link } from "react-router-dom";
import AuthIllustration from "./AuthIllustration";
import "../../styles/auth.css";
import { FiMail, FiLock, FiLogIn, FiUser } from "react-icons/fi";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [formState, setFormState] = useState({
    email: { valid: null, touched: false },
    password: { valid: null, touched: false }
  });

  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  // Removed 3D tilt effect

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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
    setFormState(prev => ({
      ...prev,
      password: {
        valid: value.length >= 6,
        touched: true
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setLocalError("Please fill in all fields.");
      return;
    }

    setLocalError("");
    await dispatch(loginUser({ email, password }));
  };

  return (
    <div className="auth-container max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left side - Form */}
      <div
        ref={formRef}
        className="auth-form-container p-8 md:p-10"
      >
        <div className="auth-decoration auth-decoration-1"></div>
        <div className="auth-decoration auth-decoration-2"></div>

        <h2 className="auth-title text-3xl font-bold text-center mb-8">Welcome Back</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {(localError || error) && (
            <div className="alert alert-error mb-4 animate-[error-shake_0.5s_ease-in-out]">
              {localError || error}
            </div>
          )}

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
                <p className="text-xs text-red-500 mt-1">Password must be at least 6 characters</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">
                Forgot password?
              </a>
            </div>
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
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FiLogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </span>
          </button>
        </form>

        <div className="auth-divider">Or</div>

        <div className="text-center">
          <p className="mb-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:text-primary-dark transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden md:block bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg overflow-hidden shadow-lg">
        <div className="h-full flex items-center justify-center p-6">
          <AuthIllustration type="signin" />
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
