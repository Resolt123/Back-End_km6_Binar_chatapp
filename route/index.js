const express = require("express");

const router = express.Router();

const authUser = require("./authUser");

router.use("/auth", authUser);

module.exports = router;
