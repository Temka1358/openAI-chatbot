import app from "./app.js";
import { connectDatabase } from "./db/connection.js";
//connection and listeners


// for server
import https from 'https';
import fs from 'fs';

const PORT = process.env.PORT || 5000;

// connectDatabase()
// .then(() => {
//   app.listen(PORT, () => {
//     console.log(`Connected to MongoDB and server is listening on port ${PORT}`);
//   })
// })
// .catch((error) => {
//   console.log("Cannot connect to mongoDB: ", error);
// });

const options = {
  key: fs.readFileSync('/var/www/https/server.key'),
  cert: fs.readFileSync('/var/www/https/server.cert')
};

connectDatabase()
  .then(() => {
    https.createServer(options, app).listen(PORT, () => {
      console.log(`Connected to MongoDB and server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Cannot connect to MongoDB: ", error);
  });