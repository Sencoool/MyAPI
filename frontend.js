// Description: Node.js HTML Client
// requires: npm install express ejs axios body-parser

const express = require("express");
const session = require("express-session");
const axios = require("axios");
const path = require("path");
const app = express();
const cookie = require("cookie-parser");
const fs = require("fs");
var bodyParser = require("body-parser");
const PBH = require("./publisher.json");

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
app.use(cookie());
app.use(
  session({
    secret: "I don't know either",
    resave: false,
    saveUninitialized: false,
  })
);

const authenticateUser = (req, res, next) => {
  if (req.cookies && req.cookies.userSession) {
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/books");
    const responsePBH = await axios.get(base_url + "/publisher");
    console.log(response);

    if (response.data == "") {
      const databooks = JSON.parse(fs.readFileSync("books.json", "utf8"));
      await axios.post(base_url + "/books", { bug: databooks });
    }

    if (responsePBH.data == "") {
      await axios.post(base_url + "/publisher", { pbh: PBH });
    }

    if (!req.session.userData) {
      req.session.userData = {
        userName: "",
      };
    }

    res.render("books", {
      books: response.data,
      data: req.session.userData,
    });
  } catch (err) {
    res.status(500).send(err);
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

app.get("/bookjoin", async (req, res) => {
  try {
    const response = await axios.get(base_url + "/booksjoin");

    if (!req.session.userData) {
      req.session.userData = {
        name: "",
      };
    }

    res.render("bookjoin", {
      publisher: response.data,
      data: req.session.userData,
    });
  } catch (err) {
    res.status(500).send("Error join");
  }
});

app.get("/create", authenticateUser, (req, res) => {
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

app.get("/update/:id", authenticateUser, async (req, res) => {
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

app.get("/delete/:id", authenticateUser, async (req, res) => {
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
    res.redirect("login");
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

      req.session.userData = {
        user_id: response.data.login.user_id,
        username: response.data.login.username,
      };
      console.log(req.session.userData);
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

app.get("/logout", (req, res) => {
  try {
    console.log(req.session.userData, "Goodbye");
    req.session.userData = null;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("error in /logout");
    res.redirect("/");
  }
});

app.listen(5500, () => {
  console.log("Example app listening at http://localhost:5500");
});
