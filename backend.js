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
// sequelize.sync({}); //CREATE TABLE IF NOT EXISTS
sequelize.sync({ force: true }); //CREATE NEW TABLE EVERY TIME U RUN

// route to get all books
app.get("/books", async (req, res) => {
  try {
    // const [books] = await conn.query("SELECT * from books");
    // res
    //   .json(book)
    Book.findAll()
      .then((books) => {
        // same with Select * from but command here is Sequelize builtin
        res.json(books); //.then async await
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } catch (err) {
    res.status(500).send(err);
  }
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

// route to create a new book
app.post("/books", async (req, res) => {
  for (let i = 0; i < req.body.bug.length; i++) {
    await Book.create(req.body.bug[i])
      .then(() => {})
      .catch((err) => {
        res.json(err);
      });
  }
  // Book.create(req.body)
  //   .then((book) => {
  //     res.send(book);
  //   })
  //   .catch((err) => {
  //     res.status(500).send(err);
  //   });
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
