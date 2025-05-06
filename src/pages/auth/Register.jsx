import RegisterForm from "../../components/auth/ResgisterForm";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);
  return (
    <div className="mt-8 p-6">
      <RegisterForm />
    </div>
  );
}

export default Register;
