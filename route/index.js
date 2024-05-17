const express = require("express");

const router = express.Router();

const authUser = require("./authUser");
const message = require("./message");

router.use("/auth", authUser);

router.use("/messages", message);

module.exports = router;
