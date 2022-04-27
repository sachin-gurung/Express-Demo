const express = require("express");

// console.log(process.env.PORT);

// create an express server from the express function above
const server = express(); // this server is deaf AF. Can't hear ANYTHING. It's locked out of the world.

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.get("/sachin", (req, res) => {
  res.send(`<h1> Hi Sachin! </h1>`);
});
