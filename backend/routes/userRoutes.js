const express = require('express');
const router = express.Router();


const {
  createUser,
  getAllUsers,
  getUserById: userId,         // renamed
  updateUser,
  deleteUser
} = require('../controller/userController');

// Routes
router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', userId);         
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
