// index.js
const inquirer = require('inquirer');
const queries = require('./queries');

async function main() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Exit'
      ],
    },
  ]);

  switch (action) {
    case 'View All Departments':
      await queries.viewAllDepartments();
      break;
    case 'View All Roles':
      await queries.viewAllRoles();
      break;
    case 'View All Employees':
      await queries.viewAllEmployees();
      break;
    case 'Add a Department':
      const { departmentName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'Enter the name of the department:',
        },
      ]);
      await queries.addDepartment(departmentName);
      break;
    case 'Add a Role':
      const { roleTitle, roleSalary, roleDepartmentId } = await inquirer.prompt([
        {
          type: 'input',
          name: 'roleTitle',
          message: 'Enter the name of the role:',
        },
        {
          type: 'input',
          name: 'roleSalary',
          message: 'Enter the salary for the role:',
        },
        {
          type: 'input',
          name: 'roleDepartmentId',
          message: 'Enter the department ID for the role:',
        },
      ]);
      await queries.addRole(roleTitle, roleSalary, roleDepartmentId);
      break;
    case 'Add an Employee':
      const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: 'Enter the first name of the employee:',
        },
        {
          type: 'input',
          name: 'lastName',
          message: 'Enter the last name of the employee:',
        },
        {
          type: 'input',
          name: 'roleId',
          message: 'Enter the role ID for the employee:',
        },
        {
          type: 'input',
          name: 'managerId',
          message: 'Enter the manager ID for the employee (optional):',
        },
      ]);
      await queries.addEmployee(firstName, lastName, roleId, managerId);
      break;
    case 'Update an Employee Role':
      const { employeeId, newRoleId } = await inquirer.prompt([
        {
          type: 'input',
          name: 'employeeId',
          message: 'Enter the ID of the employee to update:',
        },
        {
          type: 'input',
          name: 'newRoleId',
          message: 'Enter the new role ID for the employee:',
        },
      ]);
      await queries.updateEmployeeRole(employeeId, newRoleId);
      break;
    case 'Exit':
      process.exit();
  }

  main(); // Loop the main function
}

main();
