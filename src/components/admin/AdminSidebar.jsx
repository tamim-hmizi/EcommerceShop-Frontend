import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/signin");
  };

  // Current path for active link styling
  const currentPath = window.location.pathname;

  return (
    <div className="flex flex-col justify-between h-screen bg-gradient-to-b from-base-100 to-base-200 w-20 lg:w-64 p-4 border-r border-base-300 transition-all duration-300 ease-in-out">
      {/* Logo and Navigation */}
      <div>
        {/* Logo with smooth hover effect */}
        <div className="mb-8 flex items-center justify-center lg:justify-start p-2 rounded-lg hover:bg-base-300 transition-colors duration-200">
          <Link to="/admin" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="shop logo" 
              className="w-10 lg:w-12 h-auto transition-all duration-300" 
            />
            <span className="hidden lg:inline-block ml-3 text-xl font-bold text-primary">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Navigation Menu */}
        <ul className="menu gap-1">
          {[
            {
              path: "/admin/",
              name: "Dashboard",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )
            },
            {
              path: "/admin/user",
              name: "Users",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )
            },
            {
              path: "/admin/product",
              name: "Products",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              )
            },
            {
              path: "/admin/category",
              name: "Categories",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )
            },
            {
              path: "/admin/order",
              name: "Orders",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )
            }
          ].map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={`flex items-center py-3 px-4 rounded-lg transition-all duration-200 
                  ${currentPath === item.path ? 
                    'bg-primary text-primary-content font-medium' : 
                    'hover:bg-base-300 hover:text-primary'
                  }`}
              >
                <span className="flex items-center justify-center w-6 h-6">
                  {item.icon}
                </span>
                <span className="hidden lg:inline ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <div className="mb-4">
        <button 
          onClick={handleLogout} 
          className="btn btn-outline btn-error w-full group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="hidden lg:inline ml-2">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;