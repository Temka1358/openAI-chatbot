import app from "./app.js";
import { connectDatabase } from "./db/connection.js";
//connection and listeners


const PORT = process.env.PORT || 5000;

connectDatabase()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Connected to MongoDB and server is listening on port ${PORT}`);
  })
})
.catch((error) => {
  console.log("Cannot connect to mongoDB: ", error);
});

