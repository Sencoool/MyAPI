// Description: Node.js HTML Client
// requires: npm install express ejs axios body-parser

const express = require("express");
const session = require("express-session");
const axios = require("axios");
const path = require("path");
const app = express();
var bodyParser = require("body-parser");

// Base URL for the API
//const base_url = "https://api.example.com";
const base_url = "http://localhost:3000";
// const base_url = "http://node58299-jiramet-noderest.proen.app.ruk-com.cloud";

// Set the template engine
app.set("views", path.join(__dirname, "/public/views"));
app.set("view engine", "ejs"); //view file .ejs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "key cookie",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/books");
    res.render("books", { books: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Access ROOT");
  }
});

app.get("/book/:id", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/books/" + req.params.id);
    res.render("book", { book: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error id");
  }
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", async (req, res) => {
  try {
    const data = { title: req.body.title, author: req.body.author };
    await axios.post(base_url + "/books", data);
    res.redirect("/"); //redirect to first page
  } catch (err) {
    console.error(err);
    res.status(500).send("Error create");
  }
});

app.get("/update/:id", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/books/" + req.params.id);
    res.render("update", { book: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error update get");
  }
});

app.post("/update/:id", async (req, res) => {
  try {
    const data = { title: req.body.title, author: req.body.author };
    await axios.put(base_url + "/books/" + req.params.id, data);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error update post");
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    await axios.delete(base_url + "/books/" + req.params.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error delete");
  }
});

app.get("/register", (req, res) => {
  try {
    res.render("register");
  } catch (err) {
    console.error(err);
  }
});

app.post("/register", async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
    };

    await axios.post(base_url + "/register", data);
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

app.get("/login", (req, res) => {
  try {
    res.render("login");
  } catch (err) {
    console.error(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const data = {
      username: req.body.username,
      password: req.body.password,
    };

    const response = await axios.post(base_url + "/login", data);

    if (response.data.sign == true) {
      console.log(response.data.login.username, "Login Successful");
      res.redirect("/");
    } else if (response.data.sign == "Username") {
      console.log("Username is Wrong");
      res.redirect("login");
    } else if (response.data.sign == "Password") {
      console.log("Password is Wrong");
      res.redirect("login");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("error in login");
    res.redirect("/");
  }
});

app.listen(5500, () => {
  console.log("Example app listening at http://localhost:5500");
});
