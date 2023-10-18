require("dotenv").config();
require("express-async-errors");

//Security
const helmet = require("helmet");
const cors = require("cors");
const { xss } = require("express-xss-sanitizer");
const rateLimiter = require("express-rate-limit");

// Swagger

const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const express = require("express");

const app = express();

const connectDB = require("./db/connect");

const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const auth = require("./middleware/authentication");

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());

app.get("/", (req, res) => {
  res.send('<h1>Jobs API </h1><a href="/api-docs">Documentation</a>');
});

app.get("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", auth, jobRoutes);

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
