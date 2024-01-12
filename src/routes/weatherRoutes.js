const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

router.get('/weather/:userId/:date', weatherController.getWeatherDataForDay);

module.exports = router;
