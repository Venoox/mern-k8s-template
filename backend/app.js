const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

const connection = mysql.createPool({
  connectionLimit: 2,
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

if (app.get("env") === "production") {
  app.use(logger("combined"));
} else {
  app.use(logger("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get("/", function (req, res, next) {
  connection.query("SELECT * from tasks;", function (error, results, fields) {
    if (error) {
      console.log(error);
      return next(error);
    }
    res.json(results);
  });
});

app.post("/", function (req, res, next) {
  connection.query(`INSERT INTO tasks (description) VALUES ('${req.body.description}')`, function (error, result, fields) {
    if (error) {
      console.log(error);
      return next(error);
    }
    res.json({ id: result.insertId });
  });
});

app.get("/live", function (req, res, next) {
  res.send("I'm alive and well!");
});

app.get("/ready", function (req, res, next) {
  console.log(process.env.MYSQL_HOST);
  connection.getConnection((err, conn) => {
    if (err) {
      console.log(err);
      return res.status(500).send();
    }
    return res.send("I'm ready to receive traffic!");
  });
});

module.exports = app;
