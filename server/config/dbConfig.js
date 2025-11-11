require("dotenv").config({ path: __dirname + "/../.env" }); // ✅ make sure it loads
const mongoose = require("mongoose");

console.log("🔍 Loaded MONGO_URI:", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("✅ MongoDB connected successfully");
});

connection.on("error", (err) => {
  console.log("❌ MongoDB connection error:", err);
});

module.exports = mongoose;
