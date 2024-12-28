const path = require("path");
const express = require("express");
const cors = require("cors");

const db = require("./data/database");
const errorHandler = require("./middlewares/error-handler");
const authRoutes = require("./routes/auth.routes");
const contactRoute = require("./routes/contact.routes");
const clientRoutes = require("./routes/client.routes");
const adminRoutes = require("./routes/admin.routes");
const protectRoute = require("./middlewares/protect-routes");

let PORT = 6500;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/users/assets", express.static("user-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use(authRoutes);
app.use(contactRoute);
app.use("/client", protectRoute("user"), clientRoutes);
app.use("/admin", protectRoute("admin"), adminRoutes);

app.use(errorHandler);

db()
  .then(function () {
    app.listen(PORT);
    console.log(`Server running on port ${PORT}`);
  })
  .catch(function (error) {
    console.log("Failed to connect to the database!");
    console.log(error);
  });
