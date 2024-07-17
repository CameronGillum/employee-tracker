const inquirer = require('inquirer');
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432, // Default port for PostgreSQL
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

const {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} = require('./actions')(client);

async function mainMenu() {
  let exit = false;

  while (!exit) {
    const { action } = await inquirer.prompt([
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
        await viewDepartments();
        break;
      case 'View all roles':
        await viewRoles();
        break;
      case 'View all employees':
        await viewEmployees();
        break;
      case 'Add a department':
        const { name: departmentName } = await inquirer.prompt([
          {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?'
          }
        ]);
        await addDepartment(departmentName);
        break;
      case 'Add a role':
        const departments = await client.query('SELECT * FROM departments');
        const { title, salary, department_id: departmentId } = await inquirer.prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is the name of the role?'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for the role?'
          },
          {
            type: 'list',
            name: 'department_id',
            message: 'Which department does the role belong to?',
            choices: departments.rows.map(department => ({
              name: department.name,
              value: department.id
            }))
          }
        ]);
        await addRole(title, salary, departmentId);
        break;
      case 'Add an employee':
        const roles = await client.query('SELECT * FROM roles');
        const employees = await client.query('SELECT * FROM employees');
        const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
          {
            type: 'input',
            name: 'first_name',
            message: 'What is the employee\'s first name?'
          },
          {
            type: 'input',
            name: 'last_name',
            message: 'What is the employee\'s last name?'
          },
          {
            type: 'list',
            name: 'role_id',
            message: 'What is the employee\'s role?',
            choices: roles.rows.map(role => ({
              name: role.title,
              value: role.id
            }))
          },
          {
            type: 'list',
            name: 'manager_id',
            message: 'Who is the employee\'s manager?',
            choices: employees.rows.map(employee => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id
            }))
          }
        ]);
        await addEmployee(first_name, last_name, role_id, manager_id);
        break;
      case 'Update an employee role':
        const { employee_id, new_role_id } = await inquirer.prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee would you like to update?',
            choices: employees.rows.map(employee => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id
            }))
          },
          {
            type: 'list',
            name: 'role_id',
            message: 'What is the employee\'s new role?',
            choices: roles.rows.map(role => ({
              name: role.title,
              value: role.id
            }))
          }
        ]);
        await updateEmployeeRole(employee_id, new_role_id);
        break;
      case 'Quit':
        exit = true;
        console.log('Goodbye!');
        break;
    }
  }
}

mainMenu();
