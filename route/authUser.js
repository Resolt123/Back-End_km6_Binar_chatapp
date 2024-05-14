const express = require("express");
const router = express.Router();
const login = require("../controller/auth/authUser");
//const { authMiddleware } = require("../middleware/auth");

router.post("/login", login);

module.exports = router;
