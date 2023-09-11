

/*Select the database*/
USE empDB;

/* Inserting values to the employee table*/

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES("Leela","Ram", 11, 3),
("megha","anand", 4, 2),
("cathy", "Fernando", 2, 1) ,      
("julie", "Edison", 13, 4),
("leo","rains",5,3),
("rohan", "das", 10, 4);

/* Inserting values to the department table*/

INSERT INTO department (name)
VALUES("Management"),("Finance"),("Production"),("Sales");

 

/* Inserting values to the role table*/

INSERT INTO role (title, salary, department_id)
VALUES("MD",30000,1),
("manager",12000,1),
("Financialmanagement",12000,1),
("Accountant",15000,1),
("officeclerk",7000,1),
("accountmanager",20000,2),
("auditor",20000,2),
("payrole",20000,2),
("Manufacturing",14000,3),
("Product Tester",20000,3),
("Inventory",20000,3),
("salesrepresentative",10000,4),
("salesmanager",6000,4),
("advertingmanager",10000,4);
       