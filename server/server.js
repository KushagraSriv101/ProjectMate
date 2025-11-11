const express = require("express");
const app = express();
require("dotenv").config({ path: __dirname + "/.env" }); 
require("./config/dbConfig"); 

app.use(express.json());
const port = process.env.PORT || 5000;

app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/projects", require("./routes/projectsRoute"));
app.use("/api/tasks", require("./routes/tasksRoute"));
app.use("/api/notifications", require("./routes/notificationsRoute"));

const path = require("path");
__dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Node JS server listening on port ${port}`));
