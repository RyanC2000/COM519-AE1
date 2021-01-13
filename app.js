require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const countriesModel = require("./models/Country");
const expressSession = require("express-session");
const User = require("./models/User");


/**
 * Controllers (route handlers).
 */
const tasterController = require("./controllers/weekly");
const tastingController = require("./controllers/daily");
const homeController = require("./controllers/home");
const userController = require("./controllers/user");

const app = express();
app.set("view engine", "ejs");

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */




mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

/***
 * We are applying our middlewear
 */
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

app.get("/", homeController.list);

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})

app.get("/add-task", authMiddleware, (req, res) => {
  res.render("add-task", { errors: {} });
});

app.post("/weekly", tasterController.create);

app.get("/weekly", tasterController.list);
app.get("/weekly/delete/:id", tasterController.delete);
app.get("/weekly/update/:id", tasterController.edit);
app.post("/weekly/update/:id", tasterController.update);


app.get("/thoughts", tastingController.createView);
app.post("/thoughts", tastingController.create);
app.get("/update-tasting/:id", tastingController.edit);


app.get("/daily", tastingController.list);
app.get("/daily/delete/:id", tastingController.delete);

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
    `Example app listening at http://localhost:${PORT}`,
    chalk.green("✓")
  );
});
