// Description: Node Express REST API with Sequelize and SQLite CRUD Book
// npm install express sequelize sqlite3
// Run tihs file with node SequlizeSQLiteCRUDBook.js
// Test with Postman
// ORM = Object relational mapping/management give order ORM translate to SQL
// Mongo has no relation
const express = require("express");
const Sequelize = require("sequelize");
const app = express();

// parse incoming requests
app.use(express.json()); // Json middleware which converts the body to JSON

// const sequelize = new Sequelize("database", "username", "password", {
//   host: "localhost",
//   dialect: "sqlite",
//   storage: "./Database/SQBooks.sqlite",
// });

// const initMySQL = async () => {
//   conn = await mysql.createConnection({
//     host: "localhost",
//     user: "username",
//     password: "password",
//     database: "database",
//   });
// };

// create a connection to the database
const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost", // could be "/var/run/postgresql", "192.168.1.100", "your-database-host.com" up 2 where u want to run on
  dialect: "sqlite", //SQL Type Ex. sqlite,mysql,postgressql,oracle,maria
  storage: "./Database/SQBooks.sqlite",
});

// define the Book model
const Book = sequelize.define("book", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true, // increase value auto
    primaryKey: true, //PK
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Publisher = sequelize.define("publisher", {
  publisher_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  publisher: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

const Like = sequelize.define("like", {
  like_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  book_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

const User = sequelize.define("user", {
  user_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// create the books table if it doesn't exist
sequelize.sync({ force: true }); //CREATE TABLE IF NOT EXISTS
// sequelize.sync({ force: true }); //CREATE NEW TABLE EVERY TIME U RUN
// force: true, alter: true, match: true

app.get("/books", (req, res) => {
  Book.findAll()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// route to get a book by id
app.get("/books/:id", (req, res) => {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (!book) {
        res.status(404).send("Book not found");
      } else {
        res.json(book);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/books", async (req, res) => {
  if (req.body.hasOwnProperty("bug")) {
    for (let i = 0; i < req.body.bug.length; i++) {
      await Book.create(req.body.bug[i])
        .then(() => {})
        .catch((err) => {
          res.json(err);
        });
    }
  } else {
    Book.create(req.body)
      .then((book) => {
        res.send(book);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
});

// route to update a book
app.put("/books/:id", (req, res) => {
  Book.findByPk(req.params.id)
    .then((book) => {
      //Checking ID
      if (!book) {
        res.status(404).send("Book not found");
      } else {
        book
          .update(req.body)
          .then(() => {
            res.send(book);
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

// route to delete a book
app.delete("/books/:id", (req, res) => {
  Book.findByPk(req.params.id)
    .then((book) => {
      if (!book) {
        res.status(404).send("Book not found");
      } else {
        book
          .destroy()
          .then(() => {
            res.send({});
          })
          .catch((err) => {
            res.status(500).send(err);
          });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.get("/publisher", (req, res) => {
  try {
    Publisher.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err).status(500);
      });
  } catch (err) {
    res.send(err).status(500);
  }
});

app.post("/publisher", async (req, res) => {
  try {
    if (req.body.hasOwnProperty("pbh")) {
      for (let i = 0; i < req.body.pbh.length; i++) {
        await Publisher.create(req.body.pbh[i]).then(() => {});
      }
    } else {
      Publisher.create(req.body).then((data) => {
        res.json(data);
      });
    }
  } catch (err) {
    res.send(err).status(500);
  }
});

app.post("/register", async (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const login = await User.findOne({ where: { username } });
    console.log(login + "Welcome");
    if (!login) {
      console.log("Username is wrong");
      return res.json({ sign: "Username" });
    } else if (login.password !== password) {
      console.log("Password is wrong", login);
      return res.json({ sign: "Password" });
    }

    res.json({ sign: true, login });
  } catch (err) {
    res.status(500).send(err);
  }
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  // await initMySQL();
  console.log(`Example app listening at http://localhost:${port}`);
});
