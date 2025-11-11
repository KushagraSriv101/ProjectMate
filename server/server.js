// server/server.js
const express = require("express");
const path = require("path");

// Resolve project root directory once (safe and predictable)
const rootDir = path.resolve();

// Load environment variables for local development from server/.env (Render and other hosts will provide env vars)
require("dotenv").config({ path: path.join(rootDir, "server", ".env") });

// Initialize DB connection (this file already loads its own dotenv line; it's fine to keep both)
require("./config/dbConfig");

const app = express();

// Built-in middleware to parse JSON bodies
app.use(express.json());

// --- API routes ---
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/projects", require("./routes/projectsRoute"));
app.use("/api/tasks", require("./routes/tasksRoute"));
app.use("/api/notifications", require("./routes/notificationsRoute"));

// Serve React static files when in production
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(rootDir, "client", "build");
  app.use(express.static(clientBuildPath));

  // For any route not handled by API, send back React's index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// Start server
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
  console.log(`Node JS server listening on port ${port}`)
);

// Optional: graceful shutdown and basic crash handlers
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  // Close server and exit (so platform like Render can restart)
  server.close(() => process.exit(1));
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received — shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});
