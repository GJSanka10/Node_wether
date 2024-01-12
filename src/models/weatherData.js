const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  temperature: { type: Number, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('WeatherData', weatherDataSchema);
