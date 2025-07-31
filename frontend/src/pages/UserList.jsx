import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaFileCsv, FaSearch, FaSync, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../services/api';
import UserTable from '../components/UserTable';

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const [totalPages, setTotalPages] = useState(1); // New state for total pages
  const [itemsPerPage] = useState(10); // New state for items per page (matching backend default)
  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(search);
      // When search term changes, reset to the first page
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timerId);
  }, [search]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Pass currentPage and itemsPerPage to the API
      const res = await API.get(`/users?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearch}`);
      setUsers(res.data.users);
      setTotalPages(res.data.pages); // Update total pages from API response
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch users whenever debouncedSearch or currentPage changes
  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, currentPage]); // Added currentPage as a dependency

  const handleDelete = async (id) => {
    // Add a confirmation dialog before deleting
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await API.delete(`/users/${id}`);
      toast.success('User deleted successfully!');
      // After deletion, re-fetch users. Consider checking if the current page is now empty
      // and moving to the previous page if it is.
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error('Failed to delete user');
    }
  };

  const handleExport = async () => {
    try {
      const res = await API.get('/users/export/csv', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'users.csv';
      document.body.appendChild(link); // Append to body to ensure it's clickable
      link.click();
      document.body.removeChild(link); // Clean up the link element
      toast.success('CSV export started!');
    } catch (err) {
      console.error("Error exporting CSV:", err);
      toast.error('CSV export failed');
    }
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    // Show up to 5 page numbers around the current page
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md transition ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };


  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">User Management Dashboard</h2>
        <button 
          className={`p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition relative group ${isLoading ? 'cursor-not-allowed' : ''}`}
          onClick={fetchUsers}
          disabled={isLoading}
        >
          <FaSync className={`${isLoading ? 'animate-spin' : ''}`} />
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Refresh
          </span>
        </button>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4 mb-6">
        {/* Search Box */}
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Search Button (now part of the debounced search, but can be kept for explicit action) */}
        {/* <button
          className="w-full lg:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:bg-gray-400"
          onClick={fetchUsers}
          disabled={isLoading}
        >
          Search
        </button> */}

        {/* Add and Export */}
        <div className="flex gap-2 w-full lg:w-auto">
          <button 
            className="flex-1 lg:flex-initial px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            onClick={() => navigate('/add')}
          >
            <FaPlus className="inline mr-2" />
            <span className="hidden sm:inline">Add User</span>
          </button>
          <button 
            className="flex-1 lg:flex-initial px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition disabled:bg-gray-400"
            onClick={handleExport}
            disabled={isLoading}
          >
            <FaFileCsv className="inline mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-6">
        {isLoading && users.length === 0 ? ( // Show loading only if no users are loaded yet
          <div className="p-8 text-center text-gray-500">Loading users...</div>
        ) : (
          <UserTable users={users} onDelete={handleDelete} isLoading={isLoading} />
        )}
        {/* Show message if no users found after loading */}
        {!isLoading && users.length === 0 && debouncedSearch && (
          <div className="p-8 text-center text-gray-500">No users found matching your search.</div>
        )}
         {!isLoading && users.length === 0 && !debouncedSearch && (
          <div className="p-8 text-center text-gray-500">No users available. Add a new user to get started!</div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && ( // Only show pagination if there's more than one page
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft />
          </button>

          {renderPaginationButtons()}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default UserList;
