const User = require('../models/User');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

const exportUsersToCSV = async (req, res) => {
  try {
    const users = await User.find().lean(); // Fetch all users

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    const fields = ['_id', 'firstName', 'lastName', 'email', 'mobile', 'createdAt'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(users);

    const filePath = path.join(__dirname, '../exports/users.csv');
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'users.csv', (err) => {
      if (err) {
        res.status(500).send({ message: 'Error downloading CSV' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, gender, status, location } = req.body;
    const profile = req.file ? req.file.path : '';

    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      gender,
      status,
      location,
      profile
    });

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Construct search query
    const searchQuery = {
      $or: [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
    };

    const users = await User.find(search ? searchQuery : {})
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(search ? searchQuery : {});

    res.status(200).json({
      users,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, gender, status, location } = req.body;
    const profile = req.file ? req.file.path : undefined;

    const updateData = {
      firstName,
      lastName,
      email,
      mobile,
      gender,
      status,
      location,
    };

    if (profile) updateData.profile = profile;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all handlers using module.exports
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  exportUsersToCSV
};
