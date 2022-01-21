const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

let tasks = [
  {
    id: 0,
    description: "pojej juho",
  },
  {
    id: 1,
    description: "nahrani hrcka",
  },
  {
    id: 2,
    description: "umij racunalnik",
  },
  {
    id: 3,
    description: "skuhaj banano",
  },
];

app.get("/", function (req, res, next) {
  res.json(tasks);
});

app.post("/", function (req, res, next) {
  const newTask = {
    id: tasks[tasks.length - 1].id + 1,
    description: req.body.description,
  };
  tasks = [...tasks, newTask];
  res.json({ id: newTask.id });
});

module.exports = app;
