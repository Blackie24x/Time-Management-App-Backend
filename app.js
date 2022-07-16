const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const usersRoutes = require("./routes/users-routes");
const tasksRoutes = require("./routes/tasks-routes");
const spacesRoutes = require("./routes/spaces-routes");
const notesRoutes = require("./routes/notes-routes");
const app = express();

app.use(bodyParser.json());
console.log();
// app.listen(5000);
// app.use("/", (req, res) => res.send("działa"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/spaces", spacesRoutes);
app.use("/api/notes", notesRoutes);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3euv3wf.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log(process.env.PORT);
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });
