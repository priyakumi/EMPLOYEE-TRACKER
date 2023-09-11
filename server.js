// Including depencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// Connecting the database 
const connection = mysql.createConnection({
  host: "localhost",
  // port number for local host
  port: 3306,
  //username 
  user: "root",
  // password
  password: "data1234",
  //database name
  database: "empDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  console.log("EMPLOYEE TRACKER");
  console.log("=================");
  mainMenu();
});

// Shows all employees from employee table
function showEmployees() {
  const queryString = `SELECT CONCAT(e.id," ",e.first_name," ",e.last_name) as 'Employee Name', r.title as 'Role', r.salary as 'Salary', IFNULL(CONCAT(m.first_name," ",m.last_name),'No Manager') as 'Manager Name'
  FROM employee e
  LEFT JOIN employee m
      on e.manager_id = m.id
  INNER JOIN role r
      on r.id = e.role_id`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}

// Shows all employees by department using map
function showEmployeesByDepartment() {
  const queryString = `SELECT * FROM department;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const departmentsArray = data.map((department) => {
      return { name: department.name, value: department.id };
    });
   
    inquirer
      .prompt([
        {
          type: "list",
          choices: departmentsArray,
          message: "Please select a department",
          name: "departmentId",
        },
      ])
      .then(({ departmentId }) => {
        const queryString = `SELECT e.first_name as 'First Name', e.last_name as 'Last Name', d.name as 'Department'
                FROM employee e, role r, department d
                WHERE e.role_id = r.id AND r.department_id = ? AND d.id = ?;`;
        connection.query(
          queryString,
          [departmentId, departmentId],
          (err, data) => {
            if (err) throw err;
            console.table(data);
           mainMenu();
          }
        );
      });
  });
}

// Shows all employees by manager using join 
function showEmployeesByManager() {
  const queryString = `SELECT CONCAT(e.first_name," ", e.last_name) as 'Employee', r.title as 'Title', d.name as 'Department', IFNULL(CONCAT(m.first_name," ", m.last_name),'No Manager') as 'Manager' 
  FROM employee e
  LEFT JOIN employee m
      on m.id = e.manager_id
  INNER JOIN role r
      on e.role_id = r.id
  INNER JOIN department d
      on r.department_id = d.id
    `;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}

// Adds a new employee to employee table 
function addEmployee() {
  const queryString = `SELECT * FROM role;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const rolesArray = data.map((role) => {
      return { name: role.title, value: role.id };
    });
    const queryString = `SELECT * FROM employee;`;
    connection.query(queryString, (err, data) => {
      if (err) throw err;
      const employeeArray = data.map((employee) => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        };
      });
      const noneOption = { name: "None", value: null };
      employeeArray.unshift(noneOption);
      inquirer
        .prompt([
          {
            type: "input",
            message: "Please enter the employee's first name:",
            name: "firstName",
          },
          {
            type: "input",
            message: "Please nter the employee's last name:",
            name: "lastName",
          },
          {
            type: "list",
            message: "Please select the employee's role:",
            choices: rolesArray,
            name: "role",
          },
          {
            type: "list",
            message: "Please select the employee's manager:",
            choices: employeeArray,
            name: "manager",
          },
        ])
        .then(({ firstName, lastName, role, manager }) => {
          const queryString = `
          INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUE (?, ?, ?,?);`;
          connection.query(
            queryString,
            [firstName, lastName, role, manager],
            (err, data) => {
              if (err) throw err;
              console.log("ADDED!");
             
              mainMenu();
            }
          );
        });
    });
  });
}

// Delete an  employee from employee table
function deleteEmployee() {
  const queryString = `SELECT * FROM employee;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const employeeArray = data.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: "Please select the employee's manager",
          choices: employeeArray,
          name: "employee",
        },
      ])
      .then(({ employee }) => {
        const queryString = `
        DELETE FROM employee
        WHERE id = ?;`;
        connection.query(queryString, [employee], (err, data) => {
          if (err) throw err;
          console.log("DELETED! ");
          
          mainMenu();
        });
      });
  });
}

// Update the role of an employee on the employee table. 
function updateEmployeeRole() {
  const queryString = `SELECT * FROM role;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const rolesArray = data.map((role) => {
      return { name: role.title, value: role.id };
    });
    const queryString = `SELECT * FROM employee;`;
    connection.query(queryString, (err, data) => {
      if (err) throw err;
      const employeeArray = data.map((employee) => {
        return {
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            message: "please select an employee for a role update:",
            name: "employee",
            choices: employeeArray,
          },
          {
            type: "list",
            message: "please select the role for the employee:",
            name: "role",
            choices: rolesArray,
          },
        ])
        .then(({ employee, role }) => {
          const queryString = `UPDATE employee
          SET role_id = ?
          WHERE id = ?;`;
          connection.query(queryString, [role, employee], (err, data) => {
            if (err) throw err;
            console.log("UPDATED!");
            mainMenu();
          });
        });
    });
  });
}

// Update an employee's manager on the  employee table.
function updateManager() {
  const queryString = `SELECT * FROM employee;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const employeeArray = data.map((employee) => {
      return {
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      };
    });
    inquirer.prompt(
        [
            {
                type: "list",
                choices: employeeArray,
                message: "select an employee to update:",
                name: "employee"
            },
            {
                type: "list",
                choices: employeeArray,
                message: "Select the employee's new manager:",
                name: "manager"
            }
        ]
    ).then(({employee, manager}) => {
        const queryString = `UPDATE employee
          SET manager_id = ?
          WHERE id = ?;`;
        connection.query(queryString,[manager, employee], (err, data) => {
            if (err) throw err;
            console.log("UPDATED!");
            
            mainMenu();
        })
    });
  });
}

// Show all departments from the department table
function showDepartments() {
  const queryString = `SELECT * FROM department;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}

// Add a new department to department table
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter the name of the department to create:",
        name: "department",
      },
    ])
    .then(({ department }) => {
      const queryString = `
            INSERT INTO department (name)
            VALUE (?);`;
      connection.query(queryString, [department], (err, data) => {
        if (err) throw err;
        console.log("ADDED A DEPARRMENT!");
       
        mainMenu();
      });
    });
}

// View all roles from the role table
function showRoles() {
  const queryString = `
  SELECT r.id, r.title, r.salary, d.name as 'Department'
  FROM role r
  LEFT JOIN department d
      on r.department_id = d.id;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    console.table(data);
    mainMenu();
  });
}

// Add a new role to role table
function addRole() {
  const queryString = `SELECT * FROM department;`;
  connection.query(queryString, (err, data) => {
    if (err) throw err;
    const departmentsArray = data.map((department) => {
      return { name: department.name, value: department.id };
    });
    inquirer
      .prompt([
        {
          type: "input",
          message: "Please enter the role title:",
          name: "title",
        },
        {
          type: "input",
          message: "Please enter the role salary:",
          name: "salary",
        },
        {
          type: "list",
          choices: departmentsArray,
          message: "Please select a department:",
          name: "department_id",
        },
      ])
      .then(({ title, salary, department_id }) => {
        const queryString = `
      INSERT INTO role (title, salary, department_id)
      VALUE (?, ?, ?);`;
        connection.query(
          queryString,
          [title, salary, department_id],
          (err, data) => {
            if (err) throw err;
            console.log("ADDED A ROLE");
            showRoles();
            mainMenu()
          }
        );
      });
  });
}



// Exits the application
function exit() {
  console.log("Thank you");
  connection.end();
}

// mainMenu function for start the application
function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        choices: [
          "Show all employees.",
          "Show employees by department.",
          "Show employees by manager.",
          "Add a new employee.",
          "Delete an employee.",
          "Update an employee's role.",
          "Update an employee's manager.",
          "Show all departments.",
          "Add a new department.",
          "Show all roles.",
          "Add a new role.",
          new inquirer.Separator(),
          "Quit",
          new inquirer.Separator(),
        ],
        message: "Select the following options using arrow keys and press enter: ",
        name: "userInput",
      },
    ])
    .then(({ userInput }) => {
      switch (userInput) {
        case "Show all employees.":
          showEmployees();
          break;
        case "Show employees by department.":
          showEmployeesByDepartment();
          break;
          
        case "Show employees by manager.":
          showEmployeesByManager();
          break;
        case "Add a new employee.":
          addEmployee();
          break;
        case "Delete an employee.":
          deleteEmployee();
          break;
        case "Update an employee's role.":
          updateEmployeeRole();
          break;
        case "Update an employee's manager.":
          updateManager();
          break;
        case "Show all departments.":
          showDepartments();
          break;
        case "Add a new department.":
          addDepartment();
          break;
        case "Show all roles.":
          showRoles();
          break;
        case "Add a new role.":
          addRole();
          break;
        default:
          exit();
      }
    });
}
