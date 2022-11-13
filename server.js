/*************************************************************************
* WEB322– Assignment 4
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part of this assignment has been copied manually or electronically from any
other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: Hugh Kim Student ID: 141050211 Date: 2022/11/10
*
* Your app’s URL (from Cyclic Heroku) that I can click to see your application:
* ______________________________________________
*
*************************************************************************/ 

const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dataService = require("./data-service");
const exphbs = require("express-handlebars");
const { INSPECT_MAX_BYTES } = require("buffer");

const app = express();
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
const upload = multer({ storage: storage });

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.engine('.hbs', exphbs.engine({ 
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' +
            ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
            '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
           },
           equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
           }
    }
}));
app.set('view engine', '.hbs');

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
   });

app.get("/", (req, res) => {
    res.render('home');
});


app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/employees", function (req, res) {
    if(req.query.status){
        dataService.getEmployeesByStatus(req.query)
        .then((data) => {res.render("employees", {employees: data}) ;}).catch((err) => {
            console.log(err);res.render({message: "no results"});
        });
    }
    else if(req.query.department){
        dataService.getEmployeesByDepartment(req.query)
        .then((data) => {res.render("employees", {employees: data}) ;}).catch((err) => {
            console.log(err);res.render({message: "no results"});
        });
    }
    else if(req.query.manager){
        dataService.getEmployeesByManager(req.query)
        .then((data) => {res.render("employees", {employees: data}) ;}).catch((err) => {
            console.log(err);res.render({message: "no results"});
        });
    }
    else {
        dataService.getAllEmployees(req.query)
        .then((data) => {res.render("employees", {employees: data});}).catch((err) => {
            console.log(err);res.render({message: "no results"});
        });
    }
});

app.get("/employee/:employeeNum", function (req, res) {
    dataService.getEmployeeByNum(req.params)
    .then((data) => {res.render("employee",{employee: data});}).catch((err) => {
        console.log(err); res.render({message:"no results"});
    })
});

app.get("/departments", function(req,res){
    dataService.getDepartments()
    .then((data) => { res.render("departments",{departments: data});}).catch((err) => {
        console.log(err);res.render({message: "no results"});
    })
});



app.get("/employees/add", (req, res) => {
    res.render('addEmployee');
    
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.post("/employees/add", function(req,res){
    dataService.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});


app.get("/images/add", (req, res) => {
    res.render('addImage');
   
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
    res.redirect("/images");
  });


  
app.get("/images",function(req, res){
    fs.readdir("./public/images/uploaded", function(err, items) 
    {res.render("images",{data: items});}
    ); 
});

app.post("/employee/update", (req, res) => {
    console.log(req.body);
    res.redirect("/employees");
   });

app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
   });

app.use(express.static('public'));
app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname,"/views/error404.html"));});


dataService.initialize()
    .then(() => {
        app.listen(8080, onHttpStart);
    }).catch((err) => {
        console.log(err);
    });