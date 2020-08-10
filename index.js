const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./schema/db");
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(bodyParser.urlencoded({extended: true}));

app.use(cors());
app.use(express.json());
app.use(cookieSession({
  name: 'session',
  keys: ['super-secret-key', 'key2']
}));
//Routes
app.get("/", (req, res) => {
  templateVars ={
    userId : req.session.userId
  }
  res.render("index", templateVars);
});

//Adding user
app.post("/user/signup", async(req, res) => {
  try {
    console.log(req.body);
    //Request the information passed onto the text fields
    const { name, email, password } = req.body;
    //Passwords are hashed through bcrypt, which are then saved into the database
    let hashedPassword =  bcrypt.hashSync(password, saltRounds);
    console.log(name);
    //Query to insert data into the database, returns the data because users name will be added onto frontend
    const newUser = await pool.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [name, email, hashedPassword]).then((data) => {
      if (data.rowCount === 1) {
        //Finds userProfile from data
        const userProfile = data.rows[0];
        const userId = userProfile.name
        return userId;
      } else {
        console.log("No log in for you")
        res.status(403).send("Error! Name or email do not exist. Please register if you havent.")
      }
    })
    //User name gets sent to frontend via json
    res.json(newUser);
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
    console.log("First check", email);
    //Query to find full profile from email
    const currentUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email]).then((data) => {
        if (data.rowCount === 1) {
          //User is identified, userProfile is set
          const userProfile = data.rows[0];
          //Since passwords are encrypted, it decrypts the password, and verifies it with the database
          if (bcrypt.compareSync(password, userProfile.password)) {
            //The only thing we want to send to the front end is the name of the user
            const userId = userProfile.name
            console.log(userId);
            return userId;
          }
        } else {
          console.log("Error, user not found")
          res.status(403).send("Error! Name or email do not exist. Please register if you havent.")
        }
      })
    console.log("Success, user is ", currentUser);
    //Sends the name of the user to the frontend using json
    res.json(currentUser);
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