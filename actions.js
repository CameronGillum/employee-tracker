const inquirer = require('inquirer');

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
async function viewDepartments(client) {
  try {
    const res = await client.query('SELECT * FROM departments');
    console.table(res.rows);
  } catch (error) {
    console.error('Error viewing departments:', error);
  }
}

// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
async function viewRoles(client) {
  try {
    const res = await client.query('SELECT * FROM roles');
    console.table(res.rows);
  } catch (error) {
    console.error('Error viewing roles:', error);
  }
}

// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
async function viewEmployees(client) {
  try {
    const res = await client.query('SELECT * FROM employees');
    console.table(res.rows);
  } catch (error) {
    console.error('Error viewing employees:', error);
  }
}

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
async function addDepartment(client) {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the department?'
    }
  ]);

  try {
    await client.query('INSERT INTO departments (name) VALUES ($1)', [name]);
    console.log('Department added successfully!');
  } catch (error) {
    console.error('Error adding department:', error);
  }
}

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
async function addRole(client) {
  try {
    const departments = await client.query('SELECT * FROM departments');
    const { title, salary, department_id } = await inquirer.prompt([
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

    await client.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log('Role added successfully!');
  } catch (error) {
    console.error('Error adding role:', error);
  }
}

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
async function addEmployee(client) {
  try {
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

    await client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log('Employee added successfully!');
  } catch (error) {
    console.error('Error adding employee:', error);
  }
}

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
async function updateEmployeeRole(client) {
  try {
    const employees = await client.query('SELECT * FROM employees');
    const roles = await client.query('SELECT * FROM roles');

    const { employee_id, role_id } = await inquirer.prompt([
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

    await client.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Employee role updated successfully!');
  } catch (error) {
    console.error('Error updating employee role:', error);
  }
}

module.exports = {
  viewDepartments,
  viewRoles,
  viewEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
};
