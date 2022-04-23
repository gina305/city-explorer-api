'use strict' //Always do this when writing server files

const { response, application } = require('express');
//Let's scaffold
//Requires - define what is required for this server to run
const express = require('express');
const cors = require('cors');
require('dotenv').config();


//Import weather data
let data = require('./data/weather.json');

//Require temp weather data for use with building/testing this server



// Use - use the things we required. React handles this with the 'import keyworks. Express required that you define the use seperately

//Use the express package
const app = express();
app.use(cors());

//define and validate port (defined in the .env file) for this server. Consider .env file and whther it's imported if you have an issue here
const PORT = process.env.PORT || 3002


//Routes - Represent our endpoints for that our serve listens for to recieve API requests

//Express method for creating a route. Similar to the axios .get method. Express .get required parameters is the URL and the callback function used to serve the data
app.get('/', (request, response) => {

  //Response is what the server returns
  response.send("Your server is up & running!")
});

//Route for processing weather requests
app.get('/weather', (request, response) => {

  //Capture query parameters
  let lat = request.query.lat;
  let lon = request.query.lon;
  let searchQuery = request.query.city;

  console.log(searchQuery);

  //* Capture this from API later. Testmode right now
  // let cityName = "Seattle";
  // let searchQuery = lat & lon;

  //Use the find() method to discover data. The find() method returns the first element in the provided array that satisfies the provided testing function.
  const cityObj = data.find(city => city.city_name === searchQuery);
  // console.log(cityObj,"city object");
    
  //Define selected city - line 4 thru 47 is [0]
  let selectedCity = new Forecast(cityObj.data[0])

  let weatherArray = cityObj.data.map((day)=>{
   return new Forecast(day);
  })
  //Handle API requests gracefully
  if (selectedCity === undefined) {
    //Response is what the server returns
    response.send("Invalid API request. Try something like: localhost:/3001/weather?city=Seattle. Remember, API requests from this server ARE case sensitive.");

  } else {
    //Response with an array of objects to the user's request
    response.send(weatherArray);
  }
});

//UNCOMMENT TO TEST THIS CUSTOM ROUTE: Custom route that lives on your server. Should cause your server to respond to a query on this route such as localhost:3001/sayHi?name=Gina&age=30
// app.get('/sayHi', (request, response) => {

//   //Request is the data requested from a server in the form of parameters. To capture query data using the following:
//   let name = request.query.name;
//   let age = request.query.age;

//   //Response is what the server returns
//   response.send(`Hi ${name}. I see your checking for age ${age}.`)
// });


//Catchall route which triggers last if other route requests have failed
app.get('*', (request, response) => {

  //Response is what the server returns
  response.send("This URL doesnt exist. Check our URL!")
});

//Errors - Handles errors
// console.log(data.cityObj);
//Class to define what data to return to API requests
class Forecast {
  constructor(cityObj) {
   this.date = cityObj.datetime;
    this.description = cityObj.weather.description;
  }
}


//Listen - Makes the server serve data using the express listen method which takes in to parameters: port value and callback function. Every time we make a change, we must restart the server, because Express is not aware. You'll need nodemon to install nodemon for that (npm i -g nodemon). Once installed, start your server using nodemon instead of npm start
app.listen(PORT, () => console.log('Listening on: ' + PORT))


//Other notes: You can use 'npm kill-port <>' to stop a server fromn running