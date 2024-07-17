// GIVEN a command-line application that accepts user input
const inquirer = require('inquirer');
const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASS}`,
  database: `${process.env.DB_NAME}`,
  port: process.env.DB_PORT || 3001 // Default port
});

// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
async function mainMenu() {
    try {
      await client.connect();
      const answers = await inquirer.prompt([
          {
              type: 'list',
              name: 'action',
              message: 'What would you like to do?',
              choices: [
              'View all departments',
              'View all roles',
              'View all employees',
              'Add a department',
              'Add a role',
              'Add an employee',
              'Update an employee role',
              'Quit'
              ]
          }
          ]);
  
          switch (answers.action) {
              case 'View all departments':
                  await viewDepartments();
                  break;
              case 'View all roles':
                  await viewRoles();
                  break;
              case 'View all employees':
                  await viewEmployees();
                  break;
              case 'Add a department':
                  await addDepartment();
                  break;
              case 'Add a role':
                  await addRole();
                  break;
              case 'Add an employee':
                  await addEmployee();
                  break;
              case 'Update an employee role':
                  await updateEmployeeRole();
                  break;
              case 'Quit':
                  console.log('Goodbye!');
                  process.exit(0);
                  break;
          }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      await Client.end();
    }
  }
// WHEN I choose to view all departments

// THEN I am presented with a formatted table showing department names and department ids

// WHEN I choose to view all roles

// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

// WHEN I choose to view all employees

// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// WHEN I choose to add a department

// THEN I am prompted to enter the name of the department and that department is added to the database

// WHEN I choose to add a role

// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// WHEN I choose to add an employee

// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// WHEN I choose to update an employee role

// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

mainMenu(); // Start the application