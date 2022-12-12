const Sequelize = require('sequelize');


var sequelize = new Sequelize('kphbsunq', 'kphbsunq', '70ps8VLEHGpHvUnSZxu_GmRo3X_Txvev', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
    ssl: true
   },
   query:{raw: true} // update here, you. Need this
   }); 

   var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true 
    }, 
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    SSN: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressState: Sequelize.STRING,
    addressPostal: Sequelize.STRING,
    maritalStatus: Sequelize.STRING,
    isManager: Sequelize.BOOLEAN,
    employeeManagerNum: Sequelize.INTEGER,
    status: Sequelize.STRING,
    department: Sequelize.INTEGER,
    hireDate: Sequelize.STRING,
},{
        createdAt: false, 
        updatedAt: false
}
);

var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }, 
    departmentName: Sequelize.STRING},
    {
        createdAt: false, 
        updatedAt: false 
});

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then((Employee) => {
            resolve();
        }).then((Department) => {
            resolve();
        }).catch((err) => {
            reject("unable to sync the database");
        });
        reject();
    });
}

module.exports.getAllEmployees = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.findAll());
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

function getManagers() {
    return new Promise((resolve, reject) => {
        reject();
    });
}

module.exports.getDepartments = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Department.findAll());
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

module.exports.addEmployee = (employeeData) => {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (let x in employeeData) {
                if(employeeData[x] == ""){
                    employeeData[x] = null;
                }
            }
            resolve(Employee.create({
                employeeNum: employeeData.employeeNum,
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                SSN: employeeData.SSN,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                isManager: employeeData.isManager,
                addressState: employeeData.addressState,
                addressPostal: employeeData.addressPostal,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department,
                hireDate: employeeData.hireDate}));
            }).catch(() => {
                reject("unable to create employee.");
            });
        }).catch(() => {
            reject("unable to create employee.");
    });
}

module.exports.getEmployeesByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{
                    department: department
            }}));
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

module.exports.getEmployeesByStatus = (status) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{
                    status: status
                }}));
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

module.exports.getEmployeesByManager = (manager) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{
                    employeeManagerNum: manager
                }
            }));
            }).catch((err) => {
                reject("no results returned.");
        });
    });
}

module.exports.getEmployeeByNum = (num) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.findAll({
                where:{
                    employeeNum: num
                }
            }));
            }).catch((err) => {
                reject("no results returned.");
        });
    });
}

module.exports.updateEmployee = (employeeData) => {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for (let x in employeeData) {
                if(employeeData[x] == ""){
                    employeeData[x] = null;
                }
            }
            resolve(Employee.update({
                firstName: employeeData.firstName,
                lastName: employeeData.lastName,
                email: employeeData.email,
                addressStreet: employeeData.addressStreet,
                addressCity: employeeData.addressCity,
                addressPostal: employeeData.addressPostal,
                addressState: employeeData.addressPostal,
                isManager: employeeData.isManager,
                employeeManagerNum: employeeData.employeeManagerNum,
                status: employeeData.status,
                department: employeeData.department
            }, { where: {
                employeeNum: employeeData.employeeNum
            }}));
        }).catch(() => {
            reject("unable to update employee.");
        });
    });
}

module.exports.addDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for(let x in departmentData){
                if(departmentData[x] == "") {
                    departmentData[x] = null;
                }
            }
            Department.create({
                departmentId: departmentData.departmentId,
                departmentName: departmentData.departmentName
            }).then(() => {
                resolve(Department);
            }).catch((err) => {
                reject("unable to create department.");
            });
        }).catch(() => {
            reject("unable to create department.");
        });
    });
}

module.exports.updateDepartment = (departmentData) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            for(let x in departmentData){
                if(departmentData[x] == "") {
                    departmentData[x] = null;
                }
            }
            Department.update({
                departmentName: departmentData.departmentName
            }, { where: {
                departmentId: departmentData.departmentId
            }}).then(() =>{
                resolve(Department);
            }).catch((err) => {
                reject("unable to update department.");
            });
        }).catch(() => {
            reject("unable to update department.");
        });
    });
}

module.exports.getDepartmentById = (id) => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Department.findAll({
                where:{
                    departmentId: id
                }}));
        }).catch((err) => {
            reject("no results returned.");
        });
    });
}

module.exports.deleteEmployeeByNum = (empNum) =>{
    return new Promise((resolve, reject) => {
        sequelize.sync().then(() => {
            resolve(Employee.destroy({
                where:{
                    employeeNum: empNum
                }}));
        }).catch((err) => {
            reject();
        });
    });
}