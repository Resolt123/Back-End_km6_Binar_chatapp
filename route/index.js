const express = require("express");
const router = express.Router();

const authUser = require("./authUser");

router.use("/authUser", authUser);

module.exports = router;
