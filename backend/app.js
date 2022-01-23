const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mysql = require("mysql");

const app = express();

const connection = mysql.createPool({
  connectionLimit: 2,
  host: "frontend-service.default.svc.cluster.local",
  user: "template",
  password: "secret",
  database: "todo",
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
    if (error) return next(error);
    res.json(results);
  });
});

app.post("/", function (req, res, next) {
  connection.query(`INSERT INTO tasks (description) VALUES ('${req.body.description}')`, function (error, result, fields) {
    if (error) return next(error);
    res.json({ id: result.insertId });
  });
});

app.get("/live", function (req, res, next) {
  res.send("I'm alive and well!");
});

app.get("/ready", function (req, res, next) {
  connection.getConnection((err, conn) => {
    if (err) return res.status(500).send();
    return res.send("I'm ready to receive traffic!");
  });
});

module.exports = app;
