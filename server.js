'use strict' //Always do this when writing server files

const { response, application } = require('express');
//Let's scaffold
//Requires - define what is required for this server to run
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');


//Import weather data
let data = require('./data/weather.json');
//console.log(data);

//Require temp weather data for use with building/testing this server

// Use - use the things we required. React handles this with the 'import keyworks. Express required that you define the use seperately

//Instantiate and call the express package
const app = express();

app.use(cors());

//Define and validate port (defined in the .env file) for this server. Consider .env file and whther it's imported if you have an issue here
const PORT = process.env.PORT || 3002


//ROUTES - Represent our endpoints for that our serve listens for to recieve API requests

//Create route. Similar to the axios .get method. Express .get required parameters is the URL and the callback function used to serve the data
app.get('/', (request, response) => {

  //Respond when usr visits the base URL
  response.send('<p>Welcome to my server. Make an API request!</p>')
});

//Route for processing weather requests
app.get('/weather', (request, response) => {

  //Capture query parameters
  let lat = request.query.lat;
  let lon = request.query.lon;
  //let city = request.query.city;
  // console.log(lat, lon);

  let weatherUrl = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&lat=${lat}&lon=${lon}`
 // console.log(weatherUrl);

  async function start() {

    try {
      //Request an array weather data using supplied lat and lon values - returns as an array
      let cWeather = await axios.get(weatherUrl);
      //Save the returned weather data
      let arr = cWeather.data.data;

      console.log(arr);
      // console.log(WeatherUrl);

      //Map through the weather data and creat objest for each day
      const cResponse = arr.map(x =>
        new Forecast(x.datetime, x.weather.description)
      );
      //Filter the clientResponse for the last 3 days
      const filteredResponse = cResponse.splice(0, 3);
     

      //Send a response for the weather
      response.send(filteredResponse);

    } catch (error) {
      response.send("Invalid API request. Try something like: localhost:/3001/weather?city=Seattle. Remember, API request queries from this server ARE case sensitive.");

    }
  }
  //Run the start function (defined above)
  start();

});


//Catchall route which triggers last if other route requests have failed
app.get('*', (request, response) => {

  //Response is what the server returns
  response.send("This URL doesnt exist. Check our URL!")
});



class Forecast {
  constructor(datetime, description) {
    this.date = datetime;
    this.description = description;
  }
}


//Listen - Makes the server serve data using the express listen method which takes in to parameters: port value and callback function. Every time we make a change, we must restart the server, because Express is not aware. You'll need nodemon to install nodemon for that (npm i -g nodemon). Once installed, start your server using nodemon instead of npm start
app.listen(PORT, () => console.log('Listening on: ' + PORT))


//Other notes: You can use 'npm kill-port <>' to stop a server fromn running