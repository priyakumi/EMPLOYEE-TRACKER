/*Creating the database.*/

DROP DATABASE IF EXISTS empDB; 
CREATE DATABASE empDB;

/*Selecting the database.*/
USE empDB;

/*Creating the employee table.*/
CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT
);

/*Creating the role table.*/
CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    department_id INT NOT NULL
);

/*Creating the dapartment table.*/
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);



