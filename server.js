const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
  host: 'localhost',
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`
});

connection.connect(err => {
  if (err) throw err;
  mainMenu();
});

function mainMenu() {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addADepartment();
        break;
      case 'Add a role':
        addARole();
        break;
      case 'Add an employee':
        addAnEmployee();
        break;
      case 'Update an employee role':
        updateAnEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
    }
  });
}

function viewAllDepartments() {
  // Implementation for viewing all departments
}

function viewAllRoles() {
  // Implementation for viewing all roles
}

function viewAllEmployees() {
  // Implementation for viewing all employees
}

function addADepartment() {
  // Implementation for adding a department
}

function addARole() {
  // Implementation for adding a role
}

function addAnEmployee() {
  // Implementation for adding an employee
}

function updateAnEmployeeRole() {
  // Implementation for updating an employee role
}