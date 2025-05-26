import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiSave, FiAlertCircle } from "react-icons/fi";
import { updateUserProfile } from "../redux/slices/authSlice";
import Loading from "../components/Loading";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }
    
    if (user.isAdmin) {
      navigate("/admin");
      return;
    }
    
    // Initialize form with user data
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      confirmPassword: ""
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
    
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    
    if (formData.password && formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Only include password if it was provided
      const updateData = {
        name: formData.name,
        email: formData.email,
        ...(formData.password ? { password: formData.password } : {})
      };
      
      await dispatch(updateUserProfile(updateData)).unwrap();
      setSuccessMessage("Profile updated successfully");
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
    } catch (err) {
      setFormErrors({
        submit: err.message || "Failed to update profile. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information</p>
        </div>
        
        <div className="p-6 sm:p-8">
          {error && (
            <div className="alert alert-error mb-6 flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
          
          {formErrors.submit && (
            <div className="alert alert-error mb-6 flex items-center gap-3">
              <FiAlertCircle className="w-5 h-5" />
              <span>{formErrors.submit}</span>
            </div>
          )}
          
          {successMessage && (
            <div className="alert alert-success mb-6">
              {successMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${formErrors.name ? 'input-error' : ''}`}
                  placeholder="Your name"
                />
                {formErrors.name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.name}</span>
                  </label>
                )}
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${formErrors.email ? 'input-error' : ''}`}
                  placeholder="Your email"
                />
                {formErrors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.email}</span>
                  </label>
                )}
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FiLock className="w-4 h-4" />
                    New Password (leave blank to keep current)
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${formErrors.password ? 'input-error' : ''}`}
                  placeholder="New password (optional)"
                />
                {formErrors.password && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.password}</span>
                  </label>
                )}
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <FiLock className="w-4 h-4" />
                    Confirm New Password
                  </span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${formErrors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="Confirm new password"
                />
                {formErrors.confirmPassword && (
                  <label className="label">
                    <span className="label-text-alt text-error">{formErrors.confirmPassword}</span>
                  </label>
                )}
              </div>
              
              <div className="form-control mt-4">
                <button 
                  type="submit" 
                  className="btn btn-primary gap-2"
                  disabled={isSubmitting}
                >
                  <FiSave className="w-4 h-4" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
