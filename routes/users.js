const express = require("express");
const router = express.Router();
const User = require("../models/user");

// get all
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get one
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

// creating one
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    userIsMemberOf: req.body.userIsMemberOf,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// updating the one, if WOULD use PUT it would replace all info
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.userIsMemberOf != null) {
    res.user.userIsMemberOf = req.body.userIsMemberOf;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete one
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

async function getUser(req, res, next) {
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.user = user;
  next();
}

module.exports = router;
