import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../services/UserService";
import { useSelector } from "react-redux";
import Loading from "../Loading";

function AdminUserTable({ token }) {
  const currentUser = useSelector((state) => state.auth.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers(token);
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchUsers();
  }, [token]);

  // Handle deleting a single user
  const handleDelete = async (_id) => {
    try {
      await deleteUser(_id, token);
      setUsers(users.filter((user) => user._id !== _id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="admin-table-container p-4">
      {loading ? (
        <div className="flex justify-center items-center">
          <Loading />
        </div>
      ) : users.filter((user) => user._id !== currentUser._id).length === 0 ? (
        <div className="text-center text-xl text-gray-500">
          No users available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            {/* Table Head */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {users
                .filter((user) => user._id !== currentUser._id) // Filter out the admin user
                .map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="flex space-x-2">
                      {/* Show delete button for all users */}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="btn btn-sm btn-error"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUserTable;
