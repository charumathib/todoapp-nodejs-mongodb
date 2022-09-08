// run app using express
const express = require("express");
const app = express();
// contains config for connecting to MongoDB
const dotenv = require("dotenv");
// mongoose creates a connection between MongoDB and the Node.js JavaScript runtime environment
const mongoose = require("mongoose");

// import datamodel for todo task
const TodoTask = require("./models/TodoTask");

dotenv.config();

// allows us to access our CSS file from the 'public' folder
app.use("/public", express.static("public"));
// allows us to extract data from HTML form by adding it to the body of the request
app.use(express.urlencoded({ extended: true }));

// mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
  // tells express app to listen on port 3000 after connection is made
  console.log("Connected to db!");
  app.listen(5000, () => console.log("Server Up and running"));
});

// recognizes our app's template files
app.set("view engine", "ejs");

// renders the HTML in 'todo.ejs' when endpoint '/' is hit (our homepage) along with all tasks from db
app.get("/", (req, res) => {
  TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
  });
});

// adds todos to our database
app.post("/", async (req, res) => {
  // format body into TodoTask schema
  const todoTask = new TodoTask({
    content: req.body.content,
  });
  try {
    // save task to database and redirect to homepage
    await todoTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

//UPDATE
app
  .route("/edit/:id")
  .get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
      res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
  })
  .post((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
      if (err) return res.send(500, err);
      res.redirect("/");
    });
  });

//DELETE
app.route("/remove/:id").get((req, res) => {
  const id = req.params.id;
  TodoTask.findByIdAndRemove(id, (err) => {
    if (err) return res.send(500, err);
    res.redirect("/");
  });
});
