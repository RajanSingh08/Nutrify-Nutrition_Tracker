require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
// const SendOtp = require('sendotp');
// const sendOtp = new SendOtp('AuthKey');
const passwordReset = require("./passwordReset");
const verifyToken = require("./verifyToken");
const foodModel = require("./models/foodModel");
const userModel = require("./models/userModel");
const trackModel = require("./models/tracking");
const otpModel = require("./models/login-otp");
const { otpValidation } = require("./helper/otpValidation");
const { sendMail } = require("./helper/mailer");

const PORT = 8080;
const app = express();
app.use(express.json());
app.use(cors());

//mongoose connection
mongoose
  .connect("mongodb+srv://rajansingh2003rs:JtQ5NbvvfpWgAda3@cluster0.utt9pib.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Server is connected with database");
  })
  .catch((err) => {
    console.log(err);
  });

  app.post("/registration", async (req, res) => {
    const { name, email, password, age, mobile } = req.body;
  
    // Validate request data
    if (!name || !email || !password || !age || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Check if email is already registered
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already registered" });
      }
  
      // Generate salt
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error generating salt" });
        }
  
        // Hash password with generated salt
        bcrypt.hash(password, salt, async (err, hashedPassword) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "Error hashing password" });
          }
  
          try {
            // Create a new user document
            const newUser = new userModel({
              name,
              email,
              password: hashedPassword,
              age,
              mobile
            });
            await newUser.save();
  
            return res.status(201).json({ message: "User Created" });
          } catch (error) {
            if (error.name === "ValidationError") {
              return res.status(400).json({ message: "Validation Error", details: error });
            } else {
              console.log(error);
              return res.status(500).json({ message: "Error creating user" });
            }
          }
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

//login with password
app.post("/login", async (req, res) => {
  const userCred = req.body;
  const data = await userModel.findOne({ email: userCred.email });
  if (data) {
    bcrypt.compare(userCred.password, data.password, (err, success) => {
      if (success === true) {
        jwt.sign({ email: userCred.email }, "token", (err1, token) => {
          if (!err1) {
            res.send({
              message: "Logged in Successfully",
              token: token,
              userid: data._id,
              name: data.name,
            });
          } else {
            console.log(err1);
            res.send(err1);
          }
        });
      } else {
        res.status(500).send({ message: "Incorrect Password" });
      }
    });
  } else {
    res.send({ message: "Email Not found" });
  }
});

//generating otp
const gOtp = async () => {
  return Math.round(1000 + Math.random() * 9000).toString();
};

//function for login with otp it will send otp to email
const login = async (req, res) => {
  const userEmail = req.body;
  const data = await userModel.findOne({ email: userEmail.email });
  if (data) {
    const generateOtp = await gOtp();
    const cDate = new Date();
    await otpModel.findOneAndUpdate(
      { user_id: data._id },
      {
        otp: generateOtp,
        isVerified: false,
        timstamp: new Date(cDate.getTime()),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    const html = generateOtp;
    sendMail(userEmail.email, "OTP", html);

    return res.status(200).send({
      success: true,
      msg: "Otp send to mail",
      user_id: data._id,
      otp: generateOtp,
    });
  } else {
    res.send({ message: "Email Not found" });
  }
};

//it will verify otp sent to mail
const verifyOtp = async (req, res) => {
  try {
    const { user_id, otp } = req.body;
    const otpData = await otpModel.findOne({ user_id, otp });
    if (!otpData) {
      return res.status(200).send({ message: "You have entered wrong otp" });
    }
    const otpisExpired = await otpValidation(otpData.timestamp);
    if (otpisExpired == true) {
      return res.status(200).send({ message: "otp is expired" });
    }

    await otpModel.findByIdAndUpdate(
      { _id: otpData._id },
      {
        $set: {
          isVerified: true,
        },
      }
    );
    const userData = await userModel.findOne({ _id: otpData.user_id });
    // console.log(userData);
    jwt.sign({ email: userData.email }, "token", (err1, token) => {
      if (!err1) {
        res.send({
          message: "Logged in Successfully",
          token: token,
          userid: data._id,
          name: data.name,
        });
      } else {
        console.log(err1);
        res.send(err1);
      }
    });

    return res.status(201).json({
      success: true,
      msg: "Login Successfully!",
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.send({ msg: "err" });
  }
};

// const smsOtp = async(req,res)=>{
//     const userData = req.body;
//     const user = await userModel.findOne({mobile : userData.mobile})
//     if (user) {
//         var generateOtp = await gOtp();
//         const cDate = new Date();
//         await otpModel.findOneAndUpdate(
//           { user_id: user._id },
//           {
//             otp: generateOtp,
//             isVerified: false,
//             timstamp: new Date(cDate.getTime()),
//           },
//           { new: true, upsert: true, setDefaultsOnInsert: true }
//         );
//         sendOtp.send(user.mobile,"55441",generateOtp,()=>{
//             return res.status(200).send({
//                 success: true,
//                 msg: "Otp send to mobile",
//                 user_id: user._id,
//                 otp : generateOtp
//               });
//         })
//       } else {
//         res.send({ message: "Email Not found" });
//       }
// }

app.post("/login-otp", login);
app.post("/verify-otp", verifyOtp);
// app.post("/login-sms-otp",smsOtp);
app.use("/api/password-reset", passwordReset);

//fetch all type of foods
app.get("/foods", verifyToken, async (req, res) => {
  try {
    let foods = await foodModel.find();
    res.send(foods);
  } catch (error) {
    console.log(error);
    res.send({ message: "error occurred" });
  }
});

//fetch food by name
app.get("/foods/:name", verifyToken, async (req, res) => {
  try {
    let foods = await foodModel.find({
      name: { $regex: req.params.name, $options: "i" },
    });
    if (foods.length !== 0) {
      res.send(foods);
    } else {
      res.status(404).send({ message: "Food Item Not Fund" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some Problem in getting the food" });
  }
});

app.post("/tracking", verifyToken, async (req, res) => {
  const track = req.body;
  try {
    let data = await trackModel.create(track);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.send({ message: "error occurred" });
  }
});

app.get("/track/:userid/:date", async (req, res) => {
  let userid = req.params.userid;
  let date = req.params.date;
  try {
    let foods = await trackModel
      .find({ userId: userid, eatenDate: date })
      .populate("userId")
      .populate("foodId");
    res.send(foods);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Some Problem in getting the food" });
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
