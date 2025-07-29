const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const {
  createUser,
  getAllUsers,
  getUserById: userId,
  updateUser,
  deleteUser,
  exportUsersToCSV
} = require('../controller/userController');

// Multer routes
router.post('/', upload.single('profile'), createUser);
router.put('/:id', upload.single('profile'), updateUser);

router.get('/export/csv', exportUsersToCSV); 
router.get('/', getAllUsers);
router.get('/:id', userId);
router.delete('/:id', deleteUser);


module.exports = router;
