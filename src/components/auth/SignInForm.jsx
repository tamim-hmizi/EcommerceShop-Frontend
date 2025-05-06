import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetError } from "../../redux/slices/authSlice";
import { Link } from "react-router-dom";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

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
    <div className="max-w-md mx-auto mt-8 p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
      <form onSubmit={handleSubmit}>
        {(localError || error) && (
          <div className="alert alert-error mb-4">{localError || error}</div>
        )}
        <div className="form-control mb-4">
          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            type="email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-control mb-6">
          <label htmlFor="password" className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            id="password"
            type="password"
            className="input input-bordered w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full mb-4"
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
      <div className="text-center">
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500 font-bold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignInForm;
