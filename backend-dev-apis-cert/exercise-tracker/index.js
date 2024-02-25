require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.connect(process.env["DB_URL"]);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const exerciseSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

const User = mongoose.model("users", userSchema);
const Exercise = mongoose.model("exercises", exerciseSchema);

app.use(cors());

app.use(express.static("public"));

app.use("/", bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  try {
    const username = req.body.username;
    const existingUser = await User.findOne({ username: username });
    if (existingUser)
      return res.json({
        username: existingUser.username,
        _id: existingUser._id,
      });
    const newUser = new User({ username: username });
    await newUser.save();
    res.json({ username: newUser.username, _id: newUser._id });
  } catch (error) {
    console.error("Error handling user creation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    const userId = req.params._id;
    const { description, duration, date } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const newExercise = new Exercise({
      user_id: userId,
      description: description,
      duration: duration,
      date: date ? new Date(date) : new Date(),
    });
    await newExercise.save();
    res.json({
      _id: user._id,
      username: user.username,
      date: newExercise.date.toDateString(),
      duration: newExercise.duration,
      description: newExercise.description,
    });
  } catch (error) {
    console.error("Error handling exercise creation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
})

app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const userId = req.params._id;
    const from = req.query.from ? new Date(req.query.from) : new Date(0);
    const to = req.query.to ? new Date(req.query.to) : new Date();
    const limit = parseInt(req.query.limit) || 0;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const log = await Exercise.find({
      user_id: userId,
      date: { $gte: from, $lte: to },
    }).limit(limit);

    const logArray = log.map((exercise) => {
      return {
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString(),
      };
    });

    res.json({
      _id: user._id,
      username: user.username,
      count: logArray.length,
      log: logArray,
    });
  } catch (error) {
    console.error("Error handling exercise retrieval:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
