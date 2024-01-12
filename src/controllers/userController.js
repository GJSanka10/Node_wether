const User = require('../models/user');

const storeUserDetails = async (req, res) => {
  try {
    const { email, location, latitude, longitude } = req.body;


    if (!email || !location || !latitude || !longitude) {
      return res.status(400).json({ error: 'All fields are required' });
    }


    const newUser = new User({ email, location, latitude, longitude });

 
    await newUser.save();


    res.status(201).json(newUser);
  } catch (error) {

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ error: errors });
    }

    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUserLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { location, latitude, longitude } = req.body;

    // Update user location in the database based on userId
    const updatedUser = await User.findByIdAndUpdate(userId, { location, latitude, longitude }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  storeUserDetails,
};
