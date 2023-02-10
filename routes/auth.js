const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcrypt");

//REGISTER

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    // console.log("user", newUser);

    // const user = await newUser.save();
    // const user = await newUser.save();

    newUser.profilePic = `${process.env.BASE_URL}/images/${newUser.profilePic}`;
    delete newUser.password;

    console.log("newuser", newUser);
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).lean();
    !user && res.status(400).json("Wrong credentials!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials!");
    user.profilePic = `${process.env.BASE_URL}/images/${user.profilePic}`;
    delete user.password;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
