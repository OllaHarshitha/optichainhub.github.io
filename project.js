const express = require('express');
const mysql = require('mysql');


const app = express();

const portNumber = 8080;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", "views");

//connect with database
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'optichain'
})

con.connect((err) => {
    if (err) throw err;
    console.log("Database is connected");
})


app.get("/db", (req, res) => {
    const q = "select count(*) as count from products";
    con.query(q, (err, results) => {
        if (err) throw err;
        const count = results[0].count;
        console.log("Number of products are: " + results[0].count);
        //res.send("Number of students in the student table: " + results[0].count);
        res.render("home", { count: count });
    })
});

app.post("/register", (req, res) => {
    const name = req.body.name;
    const product_info = { name: name };

    const q = "insert into products set ?";
    con.query(q, product_info, (err, result) => {
        if (err) throw err;
        res.redirect("/db");
    })

})


app.get("/display", (req, res) => {
    const q = "select * from products";
    con.query(q, (err, result) => {
        if (err) throw err;
        //console.log(result);
        //res.send(result);
        res.render("showAll", { data: result });
    })
})


app.get("/search", (req, res) => {
    res.render("search");
})

app.post("/search", (req, res) => {
    const id = req.body.id;
    const q = "select * from products where product_id=? ";

    con.query(q, [id], (err, result) => {
        if (err) throw err;
        // if (result.length == 0) {
        //     res.send("No such student found");
        else {
            res.render("searchResult", { data: result[0], count: result.length });
        }
    })
})

app.get("/", (req, res) => {
    res.send("The response is coming from express web server");
})

app.get("/hello", (req, res) => {
    console.log("The entered product name is: " + req.query.name);
    res.send("The entered product name is: " + req.query.name);
})

app.post("/hello", (req, res) => {
    console.log("The entered product name is: " + req.body.name);
    res.send("The entered product name is: " + req.body.name);
})

app.get("/test", (req, res) => {
    res.send("This is another test route");
})

app.listen(portNumber, () => {
    console.log("Server is listening at portNumber: " + portNumber);
})