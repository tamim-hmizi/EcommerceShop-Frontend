import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SignInForm from "../../components/auth/SignInForm";

function SignIn() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  console.log(user);
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
      <SignInForm />
    </div>
  );
}

export default SignIn;
