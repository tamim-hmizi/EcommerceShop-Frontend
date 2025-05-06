import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) navigate("/");
    if (user) if (!user.isAdmin) navigate("/");
  }, [user, navigate]);
  return <h1 className="text-3xl font-bold ">Dashboard</h1>;
}
