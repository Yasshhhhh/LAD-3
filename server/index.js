require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const brain = require("brain.js");
const net = new brain.NeuralNetwork({
  activation: "sigmoid",
  learningRate: 0.01,
});
app.use(cors());
app.use(express.json());
const url = "mongodb+srv://YashA:123@mlbd.tmzqfea.mongodb.net/users?retryWrites=true&w=majority";

mongoose.set("strictQuery", false);
async function connectToDatabase() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to user database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

connectToDatabase();
const userSchema = new mongoose.Schema({
  enroll: String,
  password: String,
  Name: String,
  Batch: String,
  T1: Number,
  T2: Number,
  T3: Number,
  C431_12_1: Number,
  C431_12_2: Number,
  C431_12_3: Number,
  C431_12_4: Number,
  C431_12_5: Number,
  C431_12_1_1: Number,
  C431_12_2_1: Number,
  C431_12_3_1: Number,
  C431_12_4_1: Number,
  C431_12_5_1: Number,
});

const User = new mongoose.model("User", userSchema);
app.get("/predictT3", async (req, res) => {
  try {
    //   const { T1, T2 } = req.body;
    const users = await User.find({});
    console.log(users);
    const trainingData = users.map((user) => ({
      input: { T1: user.T1, T2: user.T2 },
      output: { T3: user.T3 },
    }));
    net.train(trainingData);
    const T1 = 12.5;
    const T2 = 14;
    if (!T1 || !T2) {
      return res
        .status(400)
        .json({ error: "T1 and T2 are required for prediction." });
    }

    const prediction = net.run({ T1, T2 });

    const predictedT3 = prediction.T3;

    res.json({
      T1: T1,
      T2: T2,
      T3Prediction: ((predictedT3 * (T1 + T2)) / 40) * 35,
    });
  } catch (error) {
    console.error("Error predicting T3:", error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

app.get("/getUser", async (req, res) => {
  try {
    const Name = req.query.studentName;
    const email = req.query.studentMail;
    console.log(Name);
    const user = await User.findOne({ Name: Name });
    if (!user) {
      console.log(`${Name} Not found`);
      return res.send("");
    }
    //   console.log(user);
    const token = jwt.sign({ name: email }, "YourSecretKey");
    return res.json({ token, userData: user });
  } catch (error) {
    console.error("Error in /getd:", error);
    return res.status(500).send("Internal Server Error");
  }
});
app.get("/rankUsersByT1", async (req, res) => {
  try {
    const users = await User.find({});

    const sortedUsers = users.sort((a, b) => b.T1 - a.T1);

    const rankedUsers = sortedUsers.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));

    res.json(rankedUsers);
  } catch (error) {
    console.error("Error ranking users by T1 marks:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/rankUsersByT2", async (req, res) => {
  try {
    const users = await User.find({});
    const sortedUsers = users.sort((a, b) => b.T2 - a.T2);
    const rankedUsers = sortedUsers.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));
    res.json(rankedUsers);
  } catch (error) {
    console.error("Error ranking users by T2 marks:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/rankUsersByT3", async (req, res) => {
  try {
    const users = await User.find({});
    const sortedUsers = users.sort((a, b) => b.T3 - a.T3);
    const rankedUsers = sortedUsers.map((user, index) => ({
      rank: index + 1,
      ...user.toObject(),
    }));
    res.json(rankedUsers);
  } catch (error) {
    console.error("Error ranking users by T3 marks:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find({});
    // console.log(users);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/api/hello", (req, res) => {
  res.send("Hello world");
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    enroll: req.body.enroll,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        enroll: user.enroll,
        password: user.password,
      },
      process.env.JWT_SECRET
    );
    return res.json({ status: "ok", user: token });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/api/verify", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const enroll = decoded.enroll;
    const user = await User.findOne({ enroll: enroll });

    return res.json({ status: "ok", quote: user.enroll });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", error: "invalid token" });
  }
});

app.listen(5000, () => {
  console.log("Server started");
});
