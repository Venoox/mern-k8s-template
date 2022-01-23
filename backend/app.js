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

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get("/", function (req, res, next) {
  connection.query("SELECT * from tasks;", function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.post("/", function (req, res, next) {
  connection.query(`INSERT INTO tasks (description) VALUES ('${req.body.description}')`, function (error, result, fields) {
    if (error) throw error;
    res.json({ id: result.insertId });
  });
});

module.exports = app;
