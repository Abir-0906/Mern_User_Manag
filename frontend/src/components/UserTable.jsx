import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserTable({ users, onDelete, isLoading }) {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/view/${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">#</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Full Name</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Gender</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Location</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Profile</th>
            <th className="py-3 px-4 text-left font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                Loading users...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-4 px-4 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-gray-700">{index + 1}</td>
                <td className="py-3 px-4 text-gray-700">{`${user.firstName} ${user.lastName}`}</td>
                <td className="py-3 px-4 text-gray-700 truncate max-w-xs">{user.email}</td>
                <td className="py-3 px-4 text-gray-700 capitalize">{user.gender}</td>
                <td className="py-3 px-4">
                  <select 
                    defaultValue={user.status}
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-gray-700">{user.location}</td>
                <td className="py-3 px-4">
                  {user.profile ? (
                    <img
                      src={`http://localhost:5000/${user.profile}`}
                      alt="profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    onClick={() => handleView(user._id)}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => navigate(`/edit/${user._id}`)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded hover:bg-yellow-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user._id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;