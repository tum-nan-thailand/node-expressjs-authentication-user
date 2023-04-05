const express = require("express"); 
const app = express();
const cors = require("cors");;
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const errorHandler = require('./_middleware/error-handler');
const logger = require("morgan");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use(express.static(path.join(__dirname, "public")));
app.use("/image", express.static(path.join(__dirname, "public/images")));

// api routes
app.use("/", require("./routes/index"));
app.use('/users', require("./module/users.controller"));

// global error handler
app.use(errorHandler);
module.exports = app;
