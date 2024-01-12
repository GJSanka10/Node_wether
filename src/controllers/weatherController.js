const axios = require('axios');
const User = require('../models/user');
const WeatherData = require('../models/weatherData');

const getWeatherDataForDay = async (req, res) => {
  try {
    const { userId, date } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${user.latitude}&lon=${user.longitude}&appid=64846882ea8aeabc199fc132249a1124`
    );
    const temperature = weatherResponse.data.main.temp;
    const description = weatherResponse.data.weather[0].description;
    const weatherData = {
      userId,
      date,
      temperature,
      description,
    };
    const newWeatherData = new WeatherData(weatherData);
    await newWeatherData.save();

    res.status(200).json(newWeatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
module.exports = {
  getWeatherDataForDay,
};
