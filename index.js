const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./schema/db");

app.use(cors());
app.use(express.json());

//Routes
//Adding user
app.post("/user/signup", async(req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    console.log(name);
    const newUser = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [name, email, password])

    res.json(newUser.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
})
//adding sheet
app.post("/user/:id/sheets", async(req, res) => {
  try {
    const { user_id, is_public, is_saved } = req.body;
    const newUser = await pool.query(`INSERT INTO sheets (user_id, is_public, is_saved) VALUES ($1, $2, $3) RETURNING *`,
    [user_id, is_public, is_saved])

    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(err.message);
  }
})
//logging in user
app.post("/login", async(req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    const currentUser = await pool.query(`SELECT * FROM users WHERE email = $1 AND password = $2`, [
      email, password]).then((data) => {
        console.log(data)
        if (data.rowCount === 1) {
          console.log("Hurray")
        } else {
          res.status(403).send("Error! Name or email do not exist. Please register if you havent.")
        }
      })
    res.json(currentUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})

//Getting user
app.get("/user/:id", async(req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      id])

    res.json(currentUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})

//Getting all sheets
app.get("/user/:id/sheets", async(req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await pool.query(`SELECT * FROM sheets WHERE user_id = $1`, [
      id])

    res.json(currentUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})

//Getting specific sheets
app.get("/user/:id/sheets/:id", async(req, res) => {
  try {
    const { user_id, sheet_id } = req.params;
    const currentUser = await pool.query(`SELECT * FROM sheets WHERE user_id = $1 AND id = $2`, [
      user_id, sheet_id])

    res.json(currentUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})
app.listen(8001, () => {
  console.log("Server is listening");
})