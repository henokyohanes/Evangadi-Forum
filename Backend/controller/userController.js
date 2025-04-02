//db connection
const dbconnection = require("../db/config");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

// function to Register a new user
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;
  if (!username || !firstname || !lastname || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "please provide all required information!" });
  }

  try {
    // Query to check if the username or email already exists in the database
    const [existingUser] = await dbconnection.query(
      "SELECT username, userid FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    // If an existing user is found, send a 400 status with an error message
    if (existingUser.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Username or email already exists!" });
    }

    // Check if the password length is less than 8 characters
    if (password.length < 8) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Password must be at least 8 characters!" });
    }

    //Encrypt the password
    saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Proceed to insert the new user if no existing record is found
    await dbconnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    // Successfully created the user
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "You have Registerd successfully." });
  } catch (error) {
    console.error("Error creating user:", error.message);

    // Send a more generic error message to the client
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, please try again later!" });
  }
}

// function to Login the user
async function login(req, res) {
  const { email, password } = req.body;

  // Validate the email and password fields
  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: " please enter all required fields!" });
  }

  try {
    // Check if the user exists by email
    const [user] = await dbconnection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // If user is not found
    if (user.length === 0) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Incorrect email or password, Please try again!" });
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Incorrect email or password, Please try again!" });
    }
    
    // If login is successful, return a success message (or a JWT token for authentication)
    const username = user[0].username;
    const userid = user[0].userid;
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRETKEY, {expiresIn: "1d"});

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login successful.", token, userid });
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

// function to Check user validity
async function checkUser(req, res) {

  const userid = req.user.userid;

  const [data] = await dbconnection.query(
    "SELECT * FROM users WHERE userid = ?",
    [userid]
  );

  const username = data[0].username;
  const firstname = data[0].firstname;
  const lastname = data[0].lastname;
  const email = data[0].email;
  const profileimg = data[0].profileimg;
  
  res.status(StatusCodes.OK).json({
    msg: "Valid user",
    username,
    userid,
    firstname,
    lastname,
    email,
    profileimg
  });
}

module.exports = { register, login, checkUser };