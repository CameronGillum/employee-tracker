// queries.js
const db = require('./db');

async function viewAllDepartments() {
  try {
    const res = await db.query('SELECT id, name FROM department');
    console.table(res.rows);
  } catch (err) {
    console.error('Error fetching departments:', err.stack);
  }
}

async function viewAllRoles() {
  try {
    const res = await db.query(`
      SELECT roles.id, roles.title, department.name AS department, roles.salary
      FROM roles
      JOIN department ON roles.department_id = department.id
    `);
    console.table(res.rows);
  } catch (err) {
    console.error('Error fetching roles:', err.stack);
  }
}

async function viewAllEmployees() {
  try {
    const res = await db.query(`
      SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.name AS department, roles.salary, 
             CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employee
      JOIN roles ON employee.role_id = roles.id
      JOIN department ON roles.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id
    `);
    console.table(res.rows);
  } catch (err) {
    console.error('Error fetching employees:', err.stack);
  }
}

async function addDepartment(name) {
  try {
    await db.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Added department: ${name}`);
  } catch (err) {
    console.error('Error adding department:', err.stack);
  }
}

async function addRole(title, salary, departmentId) {
  try {
    await db.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, departmentId]);
    console.log(`Added role: ${title}`);
  } catch (err) {
    console.error('Error adding role:', err.stack);
  }
}

async function addEmployee(firstName, lastName, roleId, managerId) {
  try {
    await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [firstName, lastName, roleId, managerId]);
    console.log(`Added employee: ${firstName} ${lastName}`);
  } catch (err) {
    console.error('Error adding employee:', err.stack);
  }
}

async function updateEmployeeRole(employeeId, roleId) {
  try {
    await db.query('UPDATE employee SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
    console.log(`Updated employee ID ${employeeId} with role ID ${roleId}`);
  } catch (err) {
    console.error('Error updating employee role:', err.stack);
  }
}

module.exports = {
  viewAllDepartments,
  viewAllRoles,
  viewAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole
};
