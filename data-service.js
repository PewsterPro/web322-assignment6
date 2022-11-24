const { resolve4 } = require("dns/promises");
const fs = require("fs");
const { listenerCount } = require("process");
let employees = [];
let departments = [];

module.exports = {
    initialize,
    getManagers,
    getAllEmployees,
    getDepartments,
    addEmployee,
    getEmployeesByDepartment,
    getEmployeesByStatus,
    getEmployeesByManager,
    getEmployeeByNum,
    updateEmployee
}

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/employees.json',(err,data)=>{
            if (err) {
                reject("Failure to read file employees.json!");
            }
        else {
            employees = JSON.parse(data);
            fs.readFile('./data/departments.json',(err, data) => {
                if (err) {
                    reject("Failure to read file depatments.json!");
                }
            else {
            departments = JSON.parse(data);
            resolve();
             }
        });
    }
    });
});
}

function getAllEmployees() {
    return new Promise((resolve, reject) => {
    let allEmployees = employees
    if (allEmployees.length == 0) {
        reject("no results returned");
        }
    else {
        resolve(allEmployees);
        }
    });
}

function getManagers() {
    return new Promise((resolve, reject) => {
        let managers = employees.filter(employee => employee.isManager == true)
        if (managers.length == 0) {
            reject("no results returned");
        }
        else {
            resolve(managers);
        }
    });
}

function getDepartments() {
    return new Promise((resolve, reject) => {
    let allDepartments = departments
    if (allDepartments.length == 0) {
        reject("no results returned");
        }
    else {
        resolve(allDepartments);
        }
    });
}

function addEmployee(employeeData) {
    return new Promise((resolve, reject) => {
        if (!employeeData.isManager){
            employeeData.isManager = false;
        } 
        else{employeeData.isManager = true;
        }
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve();
    })
}

function getEmployeesByDepartment(department) {
    return new Promise((resolve, reject) => {    
    let empByDeprt = employees.filter(employee => employee.department == department.department)
    if (empByDeprt.length == 0) {
        reject("no results returned");
    }
    else {
        resolve(empByDeprt);
    }
});
}

function getEmployeesByStatus(status) {
    return new Promise((resolve, reject) => {  
        let empByStatus = employees.filter(employee => employee.status == status.status)
        if (empByStatus.length == 0) {
            reject("no results returned");
        }
        else {
            resolve(empByStatus);
        }
    });
}

function getEmployeesByManager(manager) {
    return new Promise((resolve, reject) => {  
        let empByManager = employees.filter(employee => employee.employeeManagerNum == manager.manager)
        if (empByManager.length == 0) {
            reject("no results returned");
        }
        else {
            resolve(empByManager);
        }
    });
}

function getEmployeeByNum(num) {
    return new Promise((resolve, reject) => {
        let empByNum = employees.filter(employee => employee.employeeNum == num.employeeNum)
        if (empByNum.length == 0) {
            reject("no results returned");
        }
        else {
            resolve(empByNum);
        }
    });
}

function updateEmployee(employeeData){
    return new Promise((resolve, reject) => {
        let newEmp = employees.filter(employee => employee.employeeNum == employeeData.employeeNum)
        if(employeeData.employeeNum == newEmp.employeeNum){
            newEmp == employeeData;
            resolve();
        }
});
}