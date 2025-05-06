import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/admin/Dashboard";

import UserLayout from "./layout/UserLayout";
import AdminLayout from "./layout/AdminLayout";
import AdminUser from "./pages/admin/AdminUser";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrder from "./pages/admin/AdminOrder";
import Prodcut from "./pages/Prodcut";
import Contact from "./pages/Contact";
import SignIn from "./pages/auth/SignIn";
import Register from "./pages/auth/Register";
import AdminCategory from "./pages/admin/AdminCategory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Layout */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="/product" element={<Prodcut />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="user" element={<AdminUser />} />
          <Route path="product" element={<AdminProduct />} />
          <Route path="order" element={<AdminOrder />} />
          <Route path="category" element={<AdminCategory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
