const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  const customErr = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (err.code && err.code == 11000) {
    customErr.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please enter another value`;
    customErr.statusCode = 400;
  }

  if (err.name === "ValidationError") {
    customErr.msg = `${Object.keys(err.errors).join(",")} are required`;
    customErr.statusCode = 400;
  }

  if (err.name === "CastError") {
    customErr.msg = `No job found with id: ${err.value}`;
    customErr.statusCode = 404;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customErr.statusCode).json({ msg: customErr.msg });
};

module.exports = errorHandlerMiddleware;
