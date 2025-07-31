import axios from 'axios';

const API = axios.create({
  baseURL: 'https://mern-user-manag-2.onrender.com/api', // ✅ Use your Render backend URL
});

export default API;
