const express = require("express");
const router = express.Router();
const User = require("../models/user");
const writeStream = require("../utils/write-stream");
const readStream = require("../utils/read-stream");

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
    await saveUsersToFlatFile();
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
    await saveUsersToFlatFile();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete one
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
    await saveUsersToFlatFile();
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

// This is just a test and a "backup" for the database...
async function saveUsersToFlatFile() {
  try {
    const users = await User.find();
    console.log("Save this to flatfile:", users);
    await writeStream(users.toString());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function readUsersFromFlatFile() {
  console.log("readUsersFromFlatFile:\n");
  console.log(await readStream());
  console.log("done");
}

async function init() {
  await saveUsersToFlatFile();
  await readUsersFromFlatFile(); // debug
}

init();

module.exports = router;
