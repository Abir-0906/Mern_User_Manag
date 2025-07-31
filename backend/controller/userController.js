import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaFileCsv, FaSearch, FaSync, FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../services/api';
import UserTable from '../components/UserTable';

function UserList() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  // Debounce search term
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);
    return () => clearTimeout(timerId);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await API.get(`/users?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearch}`);
      setUsers(res.data.users);
      setTotalPages(res.data.pages);
      setTotalUsers(res.data.total);
      
      // If current page is greater than total pages and we have pages, go to last page
      if (currentPage > res.data.pages && res.data.pages > 0) {
        setCurrentPage(res.data.pages);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error('Failed to fetch users');
      setUsers([]);
      setTotalPages(1);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch]);

  // Fetch users whenever dependencies change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await API.delete(`/users/${id}`);
      toast.success('User deleted successfully!');
      
      // If we're on the last page and it only has one user, go to previous page
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchUsers();
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error('Failed to delete user');
    }
  };

  const handleExport = async () => {
    try {
      toast.info('Starting CSV export...');
      const res = await API.get('/users/export/csv', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href); // Clean up memory
      toast.success('CSV export completed!');
    } catch (err) {
      console.error("Error exporting CSV:", err);
      toast.error('CSV export failed');
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages && pageNumber !== currentPage && !isLoading) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-1 rounded-md transition bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="start-ellipsis" className="px-2 py-1 text-gray-500">
            <FaEllipsisH className="text-xs" />
          </span>
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={isLoading}
          className={`px-3 py-1 rounded-md transition ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="end-ellipsis" className="px-2 py-1 text-gray-500">
            <FaEllipsisH className="text-xs" />
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 rounded-md transition bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  const getPaginationInfo = () => {
    if (totalUsers === 0) return 'No users found';
    
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalUsers);
    
    return `Showing ${startIndex}-${endIndex} of ${totalUsers} users`;
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">{getPaginationInfo()}</p>
        </div>
        <button 
          className={`p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition relative group ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
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
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>

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
            disabled={isLoading || totalUsers === 0}
            title={totalUsers === 0 ? 'No users to export' : 'Export all users to CSV'}
          >
            <FaFileCsv className="inline mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md mb-6">
        {isLoading && users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
            <div>Loading users...</div>
          </div>
        ) : (
          <UserTable users={users} onDelete={handleDelete} isLoading={isLoading} />
        )}
        
        {/* No users messages */}
        {!isLoading && users.length === 0 && debouncedSearch && (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">No users found matching "{debouncedSearch}"</div>
            <button
              onClick={() => setSearch('')}
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Clear search
            </button>
          </div>
        )}
        
        {!isLoading && users.length === 0 && !debouncedSearch && (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">No users available. Add a new user to get started!</div>
            <button
              onClick={() => navigate('/add')}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              <FaPlus className="inline mr-2" />
              Add Your First User
            </button>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Page info */}
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          
          {/* Pagination buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Previous page"
            >
              <FaChevronLeft />
            </button>

            <div className="flex items-center gap-1">
              {renderPaginationButtons()}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              title="Next page"
            >
              <FaChevronRight />
            </button>
          </div>
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
        theme="light"
      />
    </div>
  );
}

export default UserList;