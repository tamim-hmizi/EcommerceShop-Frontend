import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/UserService";
import { useSelector } from "react-redux";
import Loading from "../Loading";

function AdminUserTable({ token }) {
  const currentUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers(token);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDelete = async (_id) => {
    try {
      await deleteUser(_id, token);
      setUsers(users.filter((user) => user._id !== _id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users
    .filter((user) => user._id !== currentUser._id)
    .filter((user) => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="w-full md:w-64">
          <div className="form-control">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? "No matching users found" : "No users available"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try adjusting your search query"
                : "All users are currently administrators"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.role || "User"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setDeleteConfirm(user._id)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <dialog className={`modal ${deleteConfirm ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Confirm User Deletion</h3>
          <p className="py-4">
            Are you sure you want to delete this user? This action cannot be
            undone.
          </p>
          <div className="modal-action">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteConfirm)}
              className="btn btn-error"
            >
              Delete User
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default AdminUserTable;