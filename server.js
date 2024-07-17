// GIVEN a command-line application that accepts user input
const inquirer = require('inquirer');
const { Client } = require('pg');
const { 
    viewDepartments, 
    viewRoles, 
    viewEmployees, 
    addDepartment, 
    addRole, 
    addEmployee, 
    updateEmployeeRole 
} = require('./actions');

const client = new Client({
  host: 'localhost',
  user: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  port: process.env.DB_PORT || 3001 // Default port
});

// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
async function mainMenu() {
    try {
        await client.connect();
        let exit = false;

        while (!exit) {
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
  
            switch (action) {
                case 'View all departments':
                    await viewDepartments(client);
                    break;
                case 'View all roles':
                    await viewRoles(client);
                    break;
                case 'View all employees':
                    await viewEmployees(client);
                    break;
                case 'Add a department':
                    await addDepartment(client);
                    break;
                case 'Add a role':
                    await addRole(client);
                    break;
                case 'Add an employee':
                    await addEmployee(client);
                    break;
                case 'Update an employee role':
                    await updateEmployeeRole(client);
                    break;
                case 'Quit':
                    exit = true;
                    console.log('Goodbye!');
                    break;
            }
        }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      await client.end();
    }
  }

mainMenu(); // Start the application