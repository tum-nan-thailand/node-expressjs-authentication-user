const express = require("express"); //standart
const app = express();
const cors = require("cors");
app.use(cors());
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const indexRouter = require("./routes/index");
 

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// /************************************************ */

app.use(express.static(path.join(__dirname, "public")));
app.use("/image", express.static(path.join(__dirname, "public/images")));

app.use("/", indexRouter);

app.use('/users', require("./module/users.controller"));

module.exports = app;
