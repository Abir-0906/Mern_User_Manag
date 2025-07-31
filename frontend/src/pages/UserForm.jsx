import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import UserFormFields from '../components/UserFormFields';
import { FaArrowLeft } from "react-icons/fa"; // Add this for the back icon

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "Male",
    status: "Active",
    location: "",
    profile: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/users/${id}`).then((res) => {
        const { firstName, lastName, email, mobile, gender, status, location, profile } = res.data;
        setFormData({ firstName, lastName, email, mobile, gender, status, location, profile });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile") {
      setFormData({ ...formData, profile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile) newErrors.mobile = "Mobile number is required";
    if (!formData.location) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("mobile", formData.mobile);
    data.append("gender", formData.gender);
    data.append("status", formData.status);
    data.append("location", formData.location);
    if (formData.profile instanceof File) {
      data.append("profile", formData.profile);
    }

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/users/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("User updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/users", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("User created successfully");
      }
      navigate("/");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
   <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
  {/* Back Button */}
  <button
    onClick={() => navigate("/")}
    className="flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4"
  >
    <FaArrowLeft className="mr-2" />
    Back to Dashboard
  </button>

  <h2 className="text-2xl font-bold mb-6">{id ? "Edit" : "Add"} User</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
      
      
        {/* First Name */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.mobile ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        </div>

        {/* Gender */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.location ? "border-red-500" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
        </div>

        {/* Profile Image */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Profile Image</label>
          <input
            type="file"
            name="profile"
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded transition duration-200"
        >
          {id ? "Update" : "Create"} User
        </button>
      </form>
    </div>
  );
};

export default UserForm;