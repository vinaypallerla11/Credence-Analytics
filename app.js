const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "user.db");
const app = express();
app.use(express.json())
let db = null;


const initializeDBAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(-1);
  }
};
initializeDBAndServer();


// GET API

app.get("/emp/", async (request, response) => {
  const getEmpQuery = `
   SELECT
    *
   FROM
    emp;`;
  
  try{
    const EmployeeArray = await db.all(getEmpQuery);
    response.send(EmployeeArray);
  } catch (error) {
    console.log(error);
    response.status(500).send("Internal Server Error");
  }
});


// POST API

app.post("/emp/", async (request, response) => {
    const { id, name, img, summary } = request.body;

    const postEmpQuery = `
      INSERT INTO emp(id, name, img, summary)
      VALUES(?, ?, ?, ?);`;
      
    try {
        await db.run(postEmpQuery, [id, name, img, summary]);
        response.send("Employee data added successfully");
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
});


// PUT API

app.put("/emp/:id", async (request, response) => {
    const { id } = request.params;
    const {name, img, summary} = request.body;

    const updateEmpQuery = `
        UPDATE
          emp
        SET
          name = ?,
          img = ?,
          summary = ?
        WHERE
          id = ?`;
  
    try {
        await db.run(updateEmpQuery, [name, img, summary, id]);
        response.send("Employee Updated Successfully");
    } catch (error) {
        console.error("Error updating employee:", error);
        response.status(500).send("Error updating employee");
    }
});


// DELETE API

app.delete("/emp/:id", async (request, response) => {
    const { id } = request.params;
    const {name, img, summary} = request.body;
  
    const deleteEmpQuery = `
        DELETE FROM
          emp
        WHERE
          id = ${id};`;

    try{
        await db.run(deleteEmpQuery);
    response.send("Employee Deleted Successfully");
    } catch (error) {
        console.error("Error updating employee:", error);
        response.status(500).send("Error updating employee");
    }
});
