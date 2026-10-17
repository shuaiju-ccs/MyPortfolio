import "dotenv/config"; // must be the first line: loads .env into process.env
import config from "./config/config.js";
import app from "./server/express.js";
import router from "./server/assets-router.js";
import mongoose from "mongoose";

mongoose
  .connect(config.mongoUri)
  .then(() => console.log("Connected to the database!"))
  .catch((err) => console.error("Database connection failed:", err.message));

app.use("/src", router);
app.use("/", function (req, res) {
  res.send({ "message": "Welcome to My Portfolio application." });
});
app.listen(config.port);
console.log("Server running at http://localhost:%s/", config.port);
export default app;