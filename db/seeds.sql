DO $$
    DECLARE

    BEGIN

-- INSERT INTO employee (id, first_name, last_name, title, department, salary, manager)
-- VALUES 
--     (1, 'John', 'Doe', 'Sales Lead', 'Sales', 100000, ''),
--     (2, 'Mike', 'Chan', 'Salesperson', 'Sales', 80000, 'John Doe'),
--     (3, 'Ashley', 'Rodriguez', 'Lead Engineer', 'Engineering', 150000, ''),
--     (4, 'Kevin', 'Tupik', 'Software Engineer', 'Engineering', 120000, 'Ashley Rodriguez'),
--     (5, 'Kunal', 'Singh', 'Accountant Manger', 'Finance', 160000, ''),
--     (6, 'Malia', 'Brown', 'Accountant', 'Finance', 125000, 'Kunal Singh'),
--     (7, 'Sarah', 'Lourd', 'Legal Team Lead', 'Legal', 250000, ''),
--     (8, 'Tom', 'Allen', 'Lawyer', 'Legal', 120000, 'Sarah Lourd');

INSERT INTO department (id, name)
VALUES 
    (1, 'Sales'),
    (2, 'Engineering'),
    (3, 'Finance'),
    (4, 'Legal');

INSERT INTO roles (id, title, salary, department_id)
VALUES 
    (1, 'Sales Lead', 100000, 1),
    (2, 'Salesperson', 80000, 1),
    (3, 'Lead Engineer', 150000, 2),
    (4, 'Software Engineer', 120000, 2),
    (5, 'Accountant Manger', 160000, 3),
    (6, 'Accountant', 125000, 3),
    (7, 'Legal Team Lead', 250000, 4),
    (8, 'Lawyer', 120000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES 
    (1, 'John', 'Doe', 1, null),
    (2, 'Mike', 'Chan', 2, 1),
    (3, 'Ashley', 'Rodriguez', 3, null),
    (4, 'Kevin', 'Tupik', 4, 3),
    (5, 'Kunal', 'Singh', 5, null),
    (6, 'Malia', 'Brown', 6, 5),
    (7, 'Sarah', 'Lourd', 7, null),
    (8, 'Tom', 'Allen', 8, 7);

RAISE NOTICE 'Transaction complete';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'An error occurred: %', SQLERRM;
        ROLLBACK;
END $$;

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;