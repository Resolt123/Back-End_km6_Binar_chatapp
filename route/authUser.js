const express = require("express");
const router = express.Router();
const { login, googleLogin } = require("../controller/auth/authUser");
//const { authMiddleware } = require("../middleware/auth");

router.post("/login", login);
router.post("/google-login", googleLogin);
module.exports = router;
