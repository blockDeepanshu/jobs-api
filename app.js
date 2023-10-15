require("dotenv").config();
require("express-async-errors");

const express = require("express");

const app = express();

const connectDB = require("./db/connect");

const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const auth = require("./middleware/authentication");

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/job", auth, jobRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 8000;
const URL = process.env.MONGO_URI.replace(
  "<password>",
  process.env.MONGO_PASSWORD
);

const start = async () => {
  try {
    await connectDB(URL);

    app.listen(PORT, () => {
      console.log(`Listening on PORT ${PORT} 🚀 `);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
