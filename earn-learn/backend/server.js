const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

// Multer (file upload) dependencies
const multer = require("multer");
const path = require("path");

// --- Set up and config ---
const MONGODB_URI = "mongodb://localhost:27017/earnlearn";
const PORT = 3000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Multer File Upload Config ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Upload endpoint
app.post("/api/upload", upload.array("files"), (req, res) => {
  const filenames = req.files.map((f) => f.filename);
  res.json({ filenames });
});

// Make files accessible at /uploads/filename
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- User Model ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Student", "Admin"], required: true },
});
const User = mongoose.model("User", userSchema);

// --- Task Model ---
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  points: { type: Number, required: true },
  level: { type: String, enum: ["easy", "medium", "hard"], required: true },
});
const Task = mongoose.model("Task", taskSchema);

// --- Signup Route ---
app.post("/api/signup", async (req, res) => {
  try {
    console.log("SIGNUP API HIT", req.body);
    const { name, password, role } = req.body;
    if (!name || !password || !role)
      return res.status(400).json({ error: "All fields required." });
    const existingUser = await User.findOne({ name });
    if (existingUser)
      return res.status(409).json({ error: "Name already exists." });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, password: hashed, role });
    await user.save();
    res.status(201).json({ message: "Signup successful.", user: { name, role } });
  } catch (err) {
    console.error("Signup failed error:", err);
    res.status(500).json({ error: "Signup failed." });
  }
});

// --- Login Route ---
app.post("/api/login", async (req, res) => {
  try {
    const { name, password, role } = req.body;
    if (!name || !password || !role)
      return res.status(400).json({ error: "All fields required." });
    const user = await User.findOne({ name, role });
    if (!user)
      return res.status(401).json({ error: "User not found or wrong role." });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Incorrect password." });
    res.json({ message: "Login successful.", user: { name, role } });
  } catch (err) {
    res.status(500).json({ error: "Login failed." });
  }
});

// --- Admin: Create Task ---
app.post("/api/tasks", async (req, res) => {
  try {
    const { title, desc, points, level } = req.body;
    if (!title || !desc || !points || !level)
      return res.status(400).json({ error: "All fields required." });
    const task = new Task({ title, desc, points, level });
    await task.save();
    res.status(201).json({ message: "Task created.", task });
  } catch (err) {
    res.status(500).json({ error: "Could not create task." });
  }
});

// --- Students: Get All Tasks ---
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ _id: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Could not get tasks." });
  }
});

// --- Start Mongo + Server ---
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));
