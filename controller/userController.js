const userModel = require("../models/userModel");
const tokenModel = require("../models/tokenModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../middleware/emailSend");
const jwt = require("jsonwebtoken");

//register
exports.register = async (req, res) => {
  //destructuring object
  let { username, email, password, role } = req.body;

  //check if username is available or not
  let usernameExist = await userModel.findOne({ username: username });
  if (usernameExist) {
    return res.status(400).json({
      error: "Username already exists or not available",
    });
  }

  // check if emial is already registerd
  let emailExist = await userModel.findOne({ email: email });
  if (emailExist) {
    return res.status(400).json({
      errors: "Email already registered",
    });
  }

  //encrypt password to save in database
  let saltRounds = 10;
  let salt = await bcrypt.genSalt(saltRounds);
  let hashed_password = await bcrypt.hash(password, salt);

  //save user in database
  let user = await userModel.create({
    username,
    email,
    password: hashed_password,
    role: role || "consumer",
    isApproved: (role === "provider") ? false : true // providers need admin approval
  });
  if (!user) {
    return res.status(400).json({ error: "somthing went wrong" });
  }

  //generate verification token
  let newToken = await tokenModel.create({
    user: user.id,
    token: crypto.randomBytes(24).toString("hex"),
  });
  if (!newToken) {
    return res.status(400).json({ error: "something went wrong" });
  }

  // send varification link in email
  sendEmail({
    from: "bibek123@gmail.com",
    to: email,
    subject: "Verification email",
    text: "Verify your Account",
    html: `
    
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 30px;
      }
      .email-container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
      }
      .btn {
        display: inline-block;
        padding: 12px 24px;
        margin-top: 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 16px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h2>Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
     <a href='${process.env.FRONTEND_URL}/verify/${newToken.token}'><button class="btn">Verify Now</button></a>
      <p>If you did not request this, please ignore this email.</p>
      <div class="footer">
        &copy; 2025 YourAppName. All rights reserved.
      </div>
    </div>
  </body>
</html>

    `,
  });

  //send message to user
  console.log("User registered successfully:", email);
  res.send({ message: "User Register Succesfully" });
};

//verify user
exports.verifyUser = async (req, res) => {
  //get token
  let token = req.params.token;

  //check token if valid or not
  let tokenData = await tokenModel.findOne({ token });
  if (!tokenData) {
    return res.status(400).json({ error: "Invalid token or token expire" });
  }

  //find user associated with token
  let user = await userModel.findById(tokenData.user);
  if (!user) {
    return res
      .status(400)
      .json({ error: "User associated with this token is not identified" });
  }

  //check if user is already verified
  if (user.isVerified) {
    return res.status(400).json({ error: "User is verified" });
  }

  // verify user and save
  user.isVerified = true;
  user = await user.save();

  if (!user) {
    return res.status(400).json({ error: " Something went wrong" });
  }

  //send message to user
  res.send({ message: "User verified succesfully " });
};

//resend verification
exports.resendVerification = async (req, res) => {
  //check if email is registerd or not
  let emailExist = await userModel.findOne({ email: req.body.email });
  if (!emailExist) {
    return res.status(400).json({ error: "Email not registered" });
  }

  //check if user is already verified
  if (emailExist.isVerified) {
    return res.status(400).json({ error: "user is sent for re-verification" });
  }

  //generate varification token
  let newToken = await tokenModel.create({
    user: emailExist._id,
    token: crypto.randomBytes(24).toString("hex"),
  });
  if (!newToken) {
    return res.status(400).json({ error: "Something went wrong" });
  }

  //send token in email
  sendEmail({
    from: "bibek123@gmail.com",
    to: req.body.email,
    subject: "resend Verification email",
    text: "Please Verify your Account clicking the button",
    html: `
    
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 30px;
      }
      .email-container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
      }
      .btn {
        display: inline-block;
        padding: 12px 24px;
        margin-top: 20px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-size: 16px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <h2>Verify Your Email Address</h2>
      <p>Hello,</p>
      <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
     <a href='${process.env.FRONTEND_URL}/verify/${newToken.token}'><button class="btn">Verify Now</button></a>
      <p>If you did not request this, please ignore this email.</p>
      <div class="footer">
        &copy; 2025 YourAppName. All rights reserved.
      </div>
    </div>
  </body>
</html>

    
    `,
  });

  //send message to user
  res.send({ message: "User resend verification" });
};

//forget password
exports.forgetPassword = async (req, res) => {
  // check if email is registered
  let emailExist = await userModel.findOne({ email: req.body.email });
  if (!emailExist) {
    return res.status(404).json({ error: "Email does not exist!" }); // ✅ return added
  }

  // generate password reset token

  let newToken = await tokenModel.create({
    user: emailExist._id,
    token: crypto.randomBytes(24).toString("hex"),
  });
  if (!newToken) {
    return res.status(400).json({ error: "Something went wrong" }); // ✅ return already present
  }

  // send token in email
  sendEmail({
    from: "bibek123@gmail.com",
    to: req.body.email,
    subject: "Forget Password",
    text: "Click on the link to reset password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Password Reset</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 30px;
            }
            .email-container {
              max-width: 600px;
              margin: auto;
              background: #ffffff;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.05);
            }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              margin-top: 20px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              font-size: 16px;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #777;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h2>Password Reset Request</h2>
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href='${process.env.FRONTEND_URL}/resetPassword/${newToken.token}'><button class="btn">Reset Password</button></a>
            <p>If you did not request this, please ignore this email.</p>
           
          </div>
        </body>
      </html>
    `,
  });

  return res.send({ message: "Password reset link sent to your email" });
};

//reset password
exports.resetPassword = async (req, res) => {
  //check if token is valid or not
  let token = req.params.token;
  let tokenData = await tokenModel.findOne({ token });
  if (!tokenData) {
    return res.status(400).json({ error: "Invalid token or token expire" });
  }

  //find user
  let user = await userModel.findById(tokenData.user);
  if (!user) {
    return res
      .status(400)
      .json({ error: "User associated with this token is not identified" });
  }

  console.log("Password:", req.body.password);
  //encrypt password
  let salt = await bcrypt.genSalt(10);
  let hashed_password = await bcrypt.hash(req.body.password, salt);

  // save password and user
  user.password = hashed_password;
  user = await user.save();
  if (!user) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  //delete token
  let tokenDelete = await tokenModel.findByIdAndDelete(tokenData._id);
  if (!tokenDelete) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  //send msg to user
  res.send({ message: "Password reset successfully" });
};

//login
exports.login = async (req, res) => {
  //chceck if email is registered or not
  let { email, password } = req.body;

  let user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Email not registered" });
  }

  //check if password is correct or not

  let userPsd = await bcrypt.compare(password, user.password);

  if (!userPsd) {
    return res.status(400).json({ error: "Email or Password doesnot match" });
  }

  //check if user is verified or not
  if (!user.isVerified) {
    return res.status(400).json({ error: "Please verify your user Details" });
  }

  //generate login token using jwt
  let token = jwt.sign(
    {
      _id: user._id,
      role: user.role,
      user: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET
  );

  //send message and token to user
  console.log("User logged in successfully:", user.email);
  res.send({
    token: token,
    message: "Login succesfull",
    user: {
      _id: user._id,
      role: user.role,
      user: user.username,
      email: user.email,
    },
  });
};

//get all users
exports.getAllUsers = async (req, res) => {
  let users = await userModel.find();
  if (!users) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  res.send(users);
};

//get single user
exports.getSingleUser = async (req, res) => {
  try {
    // Ensure the email is passed in the request body
    const { email } = req.body;

    // Validate if email is provided
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the found user data
    console.log("User found:", user.email);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User found by ID:", user._id);
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
};

//update user
exports.updateUser = async (req, res) => {
  let { username, email, password, role } = req.body;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    password = hashedPassword;
  }

  let user = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      username,
      email,
      password,
      role,
    },
    { new: true }
  );
  if (!user) {
    return res.status(400).json({ error: "Something went wrong" });
  }
  console.log("User updated successfully:", user._id);
  res.send({ user: user, message: "User updated successfully" });
};

//delete user
exports.deleteUser = async (req, res) => {
  let user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }
  console.log("User deleted successfully:", req.params.id);
  res.send({ message: "User deleted successfully" });
};

//authenticastion and authorzation
exports.isloggedIn = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: " you are not logged in" });
    }
    let decodedData = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userModel.findById(decodedData._id);
    if (!user) {
      return res.status(401).json({ error: " Invalid user Information" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

//authenticastion and authorzation
exports.isAdmin = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: " you are not logged in" });
  }
  try {
    let decodedData = jwt.verify(token, process.env.JWT_SECRET);
    let user = await userModel.findById(decodedData._id);
    if (!user) {
      return res.status(401).json({ error: " Invalid user Information" });
    }
    if (user.role !== "admin") {
      return res.status(401).json({ error: " you are not elligible for this" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "not good" });
  }
};

exports.getUser = async (req, res) => {
  let user = jwt.verify(req.body.token, process.env.JWT_SECRET);

  if (!user) {
    return res.status(400).json({ error: "User Not Found" });
  }

  res.send({ message: "User Found", user });
};

exports.changeRole = async (req, res) => {
  let user = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      role: req.body.role,
    },
    { new: true }
  );

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  console.log("User role updated:", user._id, req.body.role);
  res.send({ message: "User role updated successfully", user });
};

exports.verifyUserByAdmin = async (req, res) => {
  let user = await userModel.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true }
  );
  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  console.log("User verified by admin:", user._id);
  res.send({ message: "User verified successfully", user });
};
