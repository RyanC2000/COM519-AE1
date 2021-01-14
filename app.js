require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
var bodyParser = require('body-parser');
const expressSession = require("express-session");
const User = require("./models/User");

const app = express();
app.set("view engine", "ejs");

const { PORT, MONGODB_URI } = process.env;


// Controller route handlers. 
const taskController = require("./controllers/task");
const thoughtController = require("./controllers/thought");
const userController = require("./controllers/user");

// Connect to database. 
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

// Instructing express to use the middleware. 
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))

app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

// Homepage. 
app.get("/", async (req, res) => {
  res.render('index');
})

// Task handling. 
app.get("/add-task", (req, res) => {
  res.render('add-task', { errors: {} })
});

app.post("/add-task", taskController.create);

app.get("/daily", taskController.listDaily);

app.get("/weekly", taskController.listWeekly);

app.get("/daily/edit-task/:id", taskController.editDaily);

app.get("/weekly/edit-task/:id", taskController.editWeekly);

app.post("/daily/edit-task/:id", taskController.updateDaily);

app.post("/weekly/edit-task/:id", taskController.updateWeekly);

app.get("/daily/delete/:id", taskController.deleteDaily);

app.get("/weekly/delete/:id", taskController.deleteWeekly);

// Thought handling. 
app.get("/thoughts", thoughtController.list);

app.get("/thoughts/delete/:id", thoughtController.delete);

app.get("/thoughts/edit-thought/:id", thoughtController.edit);

app.post("/thoughts/edit-thought/:id", thoughtController.update);

app.post("/add-thought", thoughtController.create);

// User login/sign-up functions. 
app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})

app.get("/join", (req, res) => {
  res.render('create-user', { errors: {} })
});
app.post("/join", userController.create);

app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", userController.login);

app.listen(PORT, () => {
  console.log(
    `App listening at http://localhost:${PORT}`,
    chalk.green("✓")
  );
});