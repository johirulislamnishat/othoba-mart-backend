const router = require("express").Router();
const CryptoJS = require("crypto-js");
const User = require("../models/User");


//register
router.post("/register", async (req, res) => {
  console.log(req.body);

  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });

  try {
    //save data to mongodb
    const savedUser = await newUser.save();

    //send respond to client
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});


//login
router.post("/login", async (req, res) => {
  try {
    //finding user
    const user = await User.findOne({ email: req.body.email });

    !user && res.status(401).json("Invalid email or password!");

    //decrypt password
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    //matching password
    const inputPassword = req.body.password;

    originalPassword != inputPassword &&
      res.status(401).json("Invalid email or password!");

    //omiting password from response
    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
