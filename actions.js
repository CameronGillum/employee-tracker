module.exports = (client) => {
    async function viewDepartments() {
      try {
        const res = await client.query('SELECT * FROM departments');
        console.table(res.rows);
        return res.rows;
      } catch (error) {
        console.error('Error viewing departments:', error);
        throw error;
      }
    }
  
    async function viewRoles() {
      try {
        const res = await client.query('SELECT * FROM roles');
        console.table(res.rows);
        return res.rows;
      } catch (error) {
        console.error('Error viewing roles:', error);
        throw error;
      }
    }
  
    async function viewEmployees() {
      try {
        const res = await client.query('SELECT * FROM employees');
        console.table(res.rows);
        return res.rows;
      } catch (error) {
        console.error('Error viewing employees:', error);
        throw error;
      }
    }
  
    async function addDepartment(name) {
      try {
        await client.query('INSERT INTO departments (name) VALUES ($1)', [name]);
        console.log('Department added successfully!');
      } catch (error) {
        console.error('Error adding department:', error);
        throw error;
      }
    }
  
    async function addRole(title, salary, department_id) {
      try {
        await client.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
        console.log('Role added successfully!');
      } catch (error) {
        console.error('Error adding role:', error);
        throw error;
      }
    }
  
    async function addEmployee(first_name, last_name, role_id, manager_id) {
      try {
        await client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
        console.log('Employee added successfully!');
      } catch (error) {
        console.error('Error adding employee:', error);
        throw error;
      }
    }
  
    async function updateEmployeeRole(employee_id, role_id) {
      try {
        await client.query('UPDATE employees SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
        console.log('Employee role updated successfully!');
      } catch (error) {
        console.error('Error updating employee role:', error);
        throw error;
      }
    }
  
    return {
      viewDepartments,
      viewRoles,
      viewEmployees,
      addDepartment,
      addRole,
      addEmployee,
      updateEmployeeRole
    };
  };
  