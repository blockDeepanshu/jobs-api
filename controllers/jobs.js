const { NotFoundError, BadRequestError } = require("../errors");
const Job = require("../models/Jobs");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ createdBy: userId, _id: jobId });
  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, createdBy: req.user.userId });
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id: jobId },
    user: { userId },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("Company and position cannot be empty");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findByIdAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
