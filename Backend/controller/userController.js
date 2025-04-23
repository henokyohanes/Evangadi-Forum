//db connection
const dbconnection = require("../db/config");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
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
    const [result] = await dbconnection.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    const userid = result.insertId;

    // Generate a JWT token for the new user
    const token = jwt.sign({ username, userid }, process.env.JWT_SECRETKEY, {expiresIn: "1d"})

    // Successfully created the user and sent the token
    return res
      .status(StatusCodes.CREATED)
      .json({ msg: "You have Registerd successfully.", token });
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

// Send reset link
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide your email" });
  }

  try {
    const [user] = await dbconnection.query("SELECT * FROM users WHERE email = ?", [email]);

    if (user.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "User with this email does not exist" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await dbconnection.query(
      "UPDATE users SET reset_token = ?, token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?",
      [token, email]
    );

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Reset your password",
      html: `
        <p>Hello ${user[0].firstname},</p>
        <p>You requested a password reset. Click the link below to reset it:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
      `,
    });

    res.status(StatusCodes.OK).json({ msg: "Password reset link sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Password must be at least 8 characters" });
  }

  try {
    const [user] = await dbconnection.query(
      "SELECT * FROM users WHERE reset_token = ? AND token_expiry > NOW()",
      [token]
    );

    if (user.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid or expired reset token!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await dbconnection.query(
      "UPDATE users SET password = ?, reset_token = NULL, token_expiry = NULL WHERE userid = ?",
      [hashedPassword, user[0].userid]
    );

    res.status(StatusCodes.OK).json({ msg: "Password reset successful" });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later" });
  }
};

module.exports = { register, login, checkUser, forgotPassword, resetPassword };