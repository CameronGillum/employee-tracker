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
      await client.end();
    }
  }
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
async function viewDepartments() {
    const res = await client.query('SELECT * FROM departments');
    console.table(res.rows);
}

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
async function viewRoles() {
    const res = await client.query('SELECT * FROM roles');
    console.table(res.rows);
}

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
async function viewEmployees() {
    const res = await client.query('SELECT * FROM employees');
    console.table(res.rows);
}

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
async function addDepartment() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?'
        }
    ]);

    await client.query('INSERT INTO departments (name) VALUES ($1)', [answers.name]);
    console.log('Department added successfully!');
}

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
async function addRole() {
    const departments = await client.query('SELECT * FROM departments');

    const answers = await inquirer.prompt([
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

    await client.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
    console.log('Role added successfully!');
}

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
async function addEmployee() {
    const roles = await client.query('SELECT * FROM roles');
    const employees = await client.query('SELECT * FROM employees');

    const answers = await inquirer.prompt([
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

    await client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
    console.log('Employee added successfully!');
}

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
async function updateEmployeeRole() {
    const employees = await client.query('SELECT * FROM employees');
    const roles = await client.query('SELECT * FROM roles');

    const answers = await inquirer.prompt([
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

    await client.query('UPDATE employees SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
    console.log('Employee role updated successfully!');
}

mainMenu(); // Start the application