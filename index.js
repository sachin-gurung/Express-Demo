require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

// console.log(process.env.PORT);

// create an express server from the express function above
const server = express(); // this server is deaf AF. Can't hear ANYTHING. It's locked out of the world.

// tell our server how to process different payloads
// MIDDLEWARE. We need this line to change the incoming object and change it to readable json file.
server.use(express.json()); // for parsing application/json

const PORT = process.env.PORT || 3000; // for Heroku PORT?

server.use(cors());

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Database ===========================================================

const destinations = []; // Creating an array []
const students = {
  // Creating an object {}
  dao: {
    name: "Dao",
    interests: ["tacos"],
    city: "Sac Town",
  },
  nikko: {
    name: "Nikko",
    interests: ["bananas"],
    city: "Detroit",
  },
  will: {
    name: "Will",
    interests: ["camaro", "frontier", "wrangler", "bananas"],
    city: "Detroit",
  },
};

// Path Param ================================================================

server.get("/students/name/:name", (req, res) => {
  const { name } = req.params; // this will make sure we only receive name, interests and city and all other input keys will be ignored.

  if (name) {
    const student = students[name.toLowerCase()]; // changes the input to lower case
    if (student) {
      return res.send(student); // early return
    }
    return res // early return. Using return will make sure the code stops if it reaches this point.
      .status(404)
      .send({ error: `Student by the name of ${name} could not be found` });
  }
});

server.get("/students/city/:city", (req, res) => {
  const { city } = req.params;
  if (city) {
    const filteredStudents = Object.values(students).filter(
      (student) => student.city.toLowerCase() === city.toLowerCase()
    );
    return res.send(filteredStudents);
  }
});

server.get("/students/interests/:interests", (req, res) => {
  const { interests } = req.params;

  if (interests) {
    const filteredStudents = Object.values(students).filter((student) =>
      student.interests.includes(interests.toLowerCase())
    );

    return res.send(filteredStudents);
  }
});

// Query Param =======================================================

server.get("/students", (req, res) => {
  const { name, interest, city } = req.query; // this will make sure we only receive name, interests and city and all other input keys will be ignored.

  if (name) {
    const student = students[name.toLowerCase()]; // changes the input to lower case
    if (student) {
      return res.send(student); // early return
    }
    return res // early return. Using return will make sure the code stops if it reaches this point.
      .status(404)
      .send({ error: `Student by the name of ${name} could not be found` });
  }

  let filteredStudents = Object.values(students); // This is because interests is an object []
  if (interest) {
    filteredStudents = Object.values(students).filter((student) => {
      return student.interests.includes(interest.toLowerCase());
    });
  }

  if (city) {
    filteredStudents = Object.values(filteredStudents).filter(
      (student) => student.city.toLowerCase() === city.toLowerCase()
    );
  }

  return res.send(filteredStudents);
});

// CREATE => POST
server.post("/destinations", async (req, res) => {
  // ONLY grab what I need
  const { destination, location, description } = req.body;

  // VALIDATE that input is validate (i.e. destination and location are BOTH present and NOT empty strings)
  if (
    !destination ||
    !location ||
    destination.length === 0 ||
    location.length === 0
  ) {
    return res
      .status(400)
      .send({ error: "Destination AND location are BOTH required" });
  }

  // UNSPLASH API URL with the API_KEY and the location and destination pased inas the query
  const UnsplashApiUrl = `https://api.unsplash.com/search/photos?query=${destination} ${location}&client_id=${process.env.UNSPLASH_API_KEY}`;

  // Use either Axios or node-fetch to get the photos
  const { data } = await axios.get(UnsplashApiUrl);

  // Get a random photo from data.results
  const photos = data.results;
  const randIdx = Math.floor(Math.random() * photos.length);

  // Create the new object to put in my database
  const newDest = {
    destination,
    location,
    photo: photos[randIdx].urls.small,
    description: description ? description : "",
  };

  destinations.push(newDest);

  res.redirect(303, "/destinations"); // go to a GET /destinations. 303 redirects to GET method.
});

server.get("/destinations", (req, res) => {
  res.send(destinations);
});
