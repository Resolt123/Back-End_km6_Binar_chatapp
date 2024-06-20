const express = require("express");

const router = express.Router();
const {
  login,
  googleLogin,
  register,
  profile,
  editProfileController,
} = require("../controller/auth/authUser");
const { validationHandler } = require("../middleware");
const {
  userLoginSchema,
  userRegisterSchema,
  userGoogleLoginSchema,
} = require("../validations");
// const { authMiddleware } = require("../middleware/auth");

router.get("/profile", profile);
router.post("/register", validationHandler(userRegisterSchema), register);
router.post("/login", validationHandler(userLoginSchema), login);
router.post(
  "/google-login",
  validationHandler(userGoogleLoginSchema),
  googleLogin,
);
router.patch("/edit-profile", editProfileController);

module.exports = router;
