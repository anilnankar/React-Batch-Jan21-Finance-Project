const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require("hpp");
const morgan = require("morgan");

const env = require("./config/env");
const apiV1Routes = require("./routes/v1");
const notFoundHandler = require("./middlewares/not-found.middleware");
const globalErrorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  })
);
app.use(hpp());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

if (env.nodeEnv !== "production") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Finance System API",
    environment: env.nodeEnv,
  });
});

app.use("/api/v1", apiV1Routes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
