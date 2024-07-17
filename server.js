const express = require('express');
const { Client } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const client = new Client({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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

app.use(express.json());

app.get('/departments', async (req, res) => {
  try {
    const result = await viewDepartments();
    res.json(result);
  } catch (err) {
    console.error('Error fetching departments', err);
    res.status(500).send('Server error');
  }
});

app.get('/roles', async (req, res) => {
  try {
    const result = await viewRoles();
    res.json(result);
  } catch (err) {
    console.error('Error fetching roles', err);
    res.status(500).send('Server error');
  }
});

app.get('/employees', async (req, res) => {
  try {
    const result = await viewEmployees();
    res.json(result);
  } catch (err) {
    console.error('Error fetching employees', err);
    res.status(500).send('Server error');
  }
});

app.post('/departments', async (req, res) => {
  try {
    const result = await addDepartment(req.body.name);
    res.json(result);
  } catch (err) {
    console.error('Error adding department', err);
    res.status(500).send('Server error');
  }
});

app.post('/roles', async (req, res) => {
  try {
    const { title, salary, department_id } = req.body;
    const result = await addRole(title, salary, department_id);
    res.json(result);
  } catch (err) {
    console.error('Error adding role', err);
    res.status(500).send('Server error');
  }
});

app.post('/employees', async (req, res) => {
  try {
    const { first_name, last_name, role_id, manager_id } = req.body;
    const result = await addEmployee(first_name, last_name, role_id, manager_id);
    res.json(result);
  } catch (err) {
    console.error('Error adding employee', err);
    res.status(500).send('Server error');
  }
});

app.put('/employees/:id/role', async (req, res) => {
  try {
    const { role_id } = req.body;
    const result = await updateEmployeeRole(req.params.id, role_id);
    res.json(result);
  } catch (err) {
    console.error('Error updating employee role', err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
