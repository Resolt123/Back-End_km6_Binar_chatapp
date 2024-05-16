const express = require("express");

const router = express.Router();
const { login, googleLogin } = require("../controller/auth/authUser");
const { validationHandler } = require("../middleware");
const { userLoginSchema } = require("../validations");
// const { authMiddleware } = require("../middleware/auth");

router.post("/login", validationHandler(userLoginSchema), login);
router.post("/google-login", googleLogin);
module.exports = router;
