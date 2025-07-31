import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserTable({ users, onDelete, isLoading, pagination, onPageChange }) {
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/view/${id}`);
  };

  // Destructure pagination props
  const { page, limit, total, pages } = pagination;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          {/* Table head remains the same */}
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
          
          {/* Table body remains the same */}
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
                  <td className="py-3 px-4 text-gray-700">{(page - 1) * limit + index + 1}</td>
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
                        src={`https://mern-user-manag-2.onrender.com/${user.profile}`}
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

      {/* Pagination controls */}
      {users.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
                <span className="font-medium">{total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: pages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      pageNumber === page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page === pages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    page === pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;