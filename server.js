require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const userRoutes = require('./src/routes/userRoutes');
const weatherRoutes = require('./src/routes/weatherRoutes');
const sendHourlyWeatherReports = require('./src/utils/sendHourlyWeatherReports');
const errorHandler = require('./src/utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 27017;

mongoose.connect('mongodb://localhost:27017/weather-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', weatherRoutes);

cron.schedule('0 */3 * * *', () => {
  sendHourlyWeatherReports();
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
