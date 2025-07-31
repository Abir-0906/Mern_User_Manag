import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user details');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 max-w-xl mx-auto bg-white shadow rounded">
        <div className="text-red-500">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to List
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 max-w-xl mx-auto bg-white shadow rounded">
        <p>User not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back to List
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          {user.profile ? (
            <img
              src={`http://localhost:5000/${user.profile}`}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Personal Information</h3>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Full Name:</span> {`${user.firstName} ${user.lastName}`}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Mobile:</span> {user.mobile || 'N/A'}</p>
              <p><span className="font-medium">Gender:</span> {user.gender}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-600">Account Information</h3>
            <div className="mt-2 space-y-2">
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </p>
              <p><span className="font-medium">Location:</span> {user.location || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate(`/edit/${user._id}`)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit User
        </button>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default UserView;