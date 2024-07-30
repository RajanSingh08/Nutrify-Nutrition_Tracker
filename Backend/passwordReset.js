const userModel = require("./models/userModel");
const tokenModel = require("./models/token");
const { sendMail } = require("./helper/mailer");
const crypto = require("crypto");
const joi = require("joi");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt')

router.post("/", async (req, res) => {
  try {
    const schema = joi.object({ email: joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error);
      res.send({ message: "error" });
    }
    const user = await userModel.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
      res.send({ message: "User doesn't exist" });
    }
    let token = await tokenModel.findOne({ user_id: user._id });
    if (token == null) {
      token = await new tokenModel({
        user_id: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    console.log(2);
    const link = `${process.env.BASE_URL}/api/password-reset/${user._id}/${token.token}`;
    await sendMail(user.email, "Reset", link);
    res.send({ link: link, message: "link sent" });
  } catch (err) {
    console.log(err);
  }
});

router.post("/:userId/:token", async (req, res) => {
  try {
    const schema = joi.object({ password: joi.string().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await userModel.findById(req.params.userId);
    console.log(user);
    if (user == null)
      return res.status(400).send({ message: "Invalid link or expired" });

    const token = await tokenModel.findOne({
      user_id: user._id,
      token: req.params.token,
    });
    if (token == null)
      return res.status(400).send({ message: "Invalid link or expired" });
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error generating salt" });
      }

      // Hash password with generated salt
      user.password = req.body.password;
      bcrypt.hash(user.password, salt, async (err, hpass) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error hashing password" });
        }

        user.password = hpass;
        await user.save();
        await token.deleteOne();

        res.send({ message: "password updated sucessfully" });
      });
    });
  } catch (error) {
    res.send({ message: "An error occured" });
    console.log(error);
  }
});

module.exports = router;
