const mongoose = require("mongoose");

mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (err) => {
  console.log("Mongo connection error" + err);
});

const connectDB = async (url) => {
  await mongoose.connect(url);
};

module.exports = connectDB;
