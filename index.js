//simple REST api server and routing for .ejs files
const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const TodoTask = require("./models/Task");
const port = process.env.PORT || 3000

const app = express()
dotenv.config()

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set("view engine", "ejs")

// connect to db
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true}, () => {
    console.log('Connected to MongoDB successfully')
})

// view/get all tasks present in DB
app.get('/', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    })
})    

// create/post new task item
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
});
    try {
        await todoTask.save();
        res.redirect("/");
    } 
    catch (err) {
        res.redirect("/");
    }
});

//Edit/Put an entry 
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.find({}, (err, tasks) => {
        res.render("edit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;

    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
        });
    });

// delete an entry
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
        });
    });    

// listen for server
app.listen(port, (req, res)=> {
    console.log(`Server successfully started on port ${port}`)
})