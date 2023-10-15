const notFoundMiddleware = async (req, res, next) => {
  res.status(404).json({ msg: "This route does not exists" });
};

module.exports = notFoundMiddleware;
