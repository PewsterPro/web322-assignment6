/*********************************************************************************
* WEB322 – Assignment  6
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Hugh Kim Student ID: 141050211 Date: 2022-12-11
*
* Online Cyclic Link: https://tame-jade-fox-sari.cyclic.app
*
********************************************************************************/

const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const dataService = require("./data-service");
const exphbs = require("express-handlebars");
const { INSPECT_MAX_BYTES } = require("buffer");
const dataServiceAuth = require("./data-service-auth");
const clientSessions = require('client-sessions');

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
    return new Promise((res, req) => {
        dataServiceAuth.initialize().then(() => {
            console.log("Server connected")
        }).catch((err) => {
            console.log(err);
        });
    });
}

function ensureLogin(req,res,next) {
    if (!(req.session.user)) {
        res.redirect("/login");
    }
    else { 
        next(); 
    }
};


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

app.get("/employees", ensureLogin, function(req, res) {
    if(req.query.status){
        dataService.getEmployeesByStatus(req.query)
        .then((data) => {
            if(data.length > 0) {
                res.render("employees", {employees: data});
            }
            else {
                res.render("employees",{message: "no results"});
            }
            }).catch((err) => {
            console.log(err);
        });
    }
    else if(req.query.department){
        dataService.getEmployeesByDepartment(req.query)
        .then((data) => {
            if(data.length > 0) {
                res.render("employees", {employees: data});
            }
            else {
                res.render("employees",{message: "no results"});
            }
            }).catch((err) => {
            console.log(err);
        });
    }
    else if(req.query.manager){
        dataService.getEmployeesByManager(req.query)
        .then((data) => {
            if(data.length > 0) {
                res.render("employees", {employees: data});
            }
            else {
                res.render("employees",{message: "no results"});
            }
            }).catch((err) => {
            console.log(err);
        });
    }
    else {
        dataService.getAllEmployees(req.query)
        .then((data) => {
            if(data.length > 0) {
                res.render("employees", {employees: data});
            }
            else {
                res.render("employees",{message: "no results"});
            }
            }).catch((err) => {
            console.log(err);
        });
    }
});

app.get("/employee/:employeeNum", ensureLogin,function(req, res) {
    // initialize an empty object to store the values
    let viewData = {};
    dataService.getEmployeeByNum(req.params.empNum).then((data) => {
        viewData.data = data; //store employee data in the "viewData" object as "data"
    }).catch(() => {
        viewData.data = null; // set employee to null if there was an error
    }).then(dataService.getDepartments).then((data) => {
        viewData.departments = data; // store department data in the "viewData" object as "departments"
                                     // loop through viewData.departments and once we have found the departmentId that matches
                                     // the employee's "department" value, add a "selected" property to the matching
                                     // viewData.departments object
        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.data[0].department) {
                viewData.departments[i].selected = true;
            }
        }
        // if not add department set Selected to false and promto a message to user, message like "Please Choose Department" in html.
        if (viewData.departments[viewData.departments.length-1].departmentId != viewData.data[0].department) {
            viewData.departments.Selected = false;
        }
    }).catch(() => {
        viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
        if (viewData.data == null){ // if no employee - return an error
            res.status(404).send("Employee Not Found!!!");
        } else {
            res.render("employee", { viewData: viewData }); // render the "employee" view
        }
    });
});

app.get("/departments", ensureLogin,function(req,res){
    dataService.getDepartments()
    .then((data) => { 
        
        if(data.length>0){
            res.render("departments",{departments: data});}
        else{
            res.render("departments",{message: "no results"});
        }
    }).catch((err) => {
        console.log(err);
    })
});

app.get("/department/:departmentId", ensureLogin, function(req, res){
    dataService.getDepartmentById(req.params.departmentId).then((data) => {
        res.render("department", {
           data: data
        });
    }).catch((err) => {
        res.status(404).send("Department Not Found");
    });
});

app.get("/employees/add", ensureLogin, function(req, res) {
    dataService.getDepartments().then((data) => {
        res.render("addEmployee",{departments: data});
    }).catch((err) => {
        res.render("addEmployee", {departments: []});
    });
});

app.get("/departments/add", ensureLogin, function(req, res) {
    res.render("addDepartment");
});

app.get("/employee/delete/:empNum", ensureLogin, function(req, res) {
    dataService.deleteEmployeeByNum(req.params.empNum).then((data) => {
        res.redirect("/employees");
    }).catch((err) => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    });
});


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post("/employees/add", ensureLogin, function(req,res){
    dataService.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
});

app.post("/departments/add", ensureLogin,  function(req,res) {
    dataService.addDepartment(req.body).then(() => {
        res.redirect("/departments");
    });
});


app.get("/images/add", ensureLogin, function(req, res) {
    res.render('addImage');
   
});

app.post("/images/add", ensureLogin, upload.single("imageFile"), function(req, res) {
    res.redirect("/images");
  });


  
app.get("/images", ensureLogin, function(req, res){
    fs.readdir("./public/images/uploaded", function(err, items) 
    {res.render("images",{data: items});}
    ); 
});

app.post("/employee/update", ensureLogin, function(req, res) {
    console.log(req.body);
    res.redirect("/employees");
   });

app.post("/employee/update", ensureLogin, function(req, res) {
    dataService.updateEmployee(req.body).then(() => {
        res.redirect("/employees");
    });
   });

app.get("/login", (req,res) => {
    res.render("login");
});

app.get("/register", (req,res) => {
    res.render("register");
});

app.post("/register", (req,res) => {
    dataServiceAuth.registerUser(req.body)
    .then(() => res.render("register", {successMessage: "User created" } ))
    .catch (err => res.render("register", {errorMessage: err, userName:req.body.userName }) )
});

app.post("/login", (req,res) => {
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body)
    .then(user => {
        req.session.user = {
            userName:user.userName,
            email:user.email,
            loginHistory:user.loginHistory
        }
        res.redirect("/employees");
    })
    .catch(err => {
        res.render("login", {errorMessage:err, userName:req.body.userName} )
    }) 
});

app.get("/logout", (req,res) => {
    req.session.reset();
    res.redirect("/login");
});

app.get("/userHistory", ensureLogin, (req,res) => {
    res.render("userHistory", {user:req.session.user} );
});


//app.use
app.use(express.static('public'));

app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname,"/views/error404.html"));});

app.use(clientSessions( {
    cookieName: "session",
    secret: "web_a6_secret",
    duration: 2*60*1000,
    activeDuration: 1000*60
}));

app.use((req,res,next) => {
    res.locals.session = req.session;
    next();
});



app.listen(HTTP_PORT, onHttpStart);