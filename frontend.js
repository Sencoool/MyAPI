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

app.listen(5500, () => {
  console.log("Example app listening at http://localhost:5500");
});
