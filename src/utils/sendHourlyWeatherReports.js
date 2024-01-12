const cron = require('node-cron');
const axios = require('axios');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const User = require('../models/user');
const WeatherData = require('../models/weatherData');



const transporter = nodemailer.createTransport({
  service: 'gmail',
  user: "smtp.gmail.com",
  port: 465,
  secure:true,
  auth: {
    user: 'gjsanka11@gmail.com',
    pass: 'laku wngo ugfb txeb',
  },
  authMethod: 'PLAIN',
});


const getWeatherDataForUser = async (user) => {
  const weatherResponse = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${user.latitude}&lon=${user.longitude}&appid=64846882ea8aeabc199fc132249a1124`
  );

  return {
    temperature: weatherResponse.data.main.temp,
    description: weatherResponse.data.weather[0].description,
  };
};

const sendHourlyWeatherReports = async () => {
  try {
    const users = await User.find({}, 'email latitude longitude');


    for (const user of users) {
      const weatherData = await getWeatherDataForUser(user);

      const mailOptions = {
        from: 'gjsanka11@gmail.com',
        to: user.email,
        subject: 'Hourly Weather Report',
        text: `Here is your hourly weather report:\nTemperature: ${weatherData.temperature}\nDescription: ${weatherData.description}`,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${user.email}: ${info.response}`);
    }
  } catch (error) {
    console.error('Error sending emails:', error);
  }
};

// Schedule the task to run every 3 hours
// cron.schedule('*/1 * * * *', () => {
//   sendHourlyWeatherReports();
// });

module.exports = sendHourlyWeatherReports;



