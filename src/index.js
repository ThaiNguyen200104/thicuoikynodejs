const express = require("express");
const { mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const user = require("./models/users.models");
const config = require("./config");
const app = express();

// Connect MongoDB and PORT in one function
mongoose
  .connect(config.mongodb_uri)
  .then((req, res) => {
    app.listen(config.port, () => {
      console.log(`Server is running on port: ${config.port}`);
    });
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB failed to connect");
    process.exit();
  });

// Views
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public")); // static file

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

// Function register
app.post("/register", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };

  // Check if user already existed or not to register new account
  const checkExists = await user.findOne({ name: data.name });
  if (checkExists) {
    res
      .status(404)
      .send("User is already existed, please enter a different username!");
  } else {
    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword; // Replace original password with hashed password
    const userdata = await user.insertMany(data);
    console.log(userdata);
  }
});

// Function login
app.post("/login", async (req, res) => {
  try {
    // Check if login-username == database-username
    const checkUser = await user.findOne({ name: req.body.username });
    if (!checkUser) {
      res.status(404).send("Username do not exists, please try again!");
    }
    // Check if login-password == database-password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      checkUser.password
    );
    if (isPasswordMatch) {
      res.render("home");
    } else {
      req.status(404).send("Wrong password, please try again!");
    }
  } catch {
    res.status(404).send("Wrong details");
  }
});
