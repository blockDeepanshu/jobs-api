const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide a position"],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "interview", "decline"],
        message: "{VALUE} is not a valid option",
      },
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide an user"],
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
