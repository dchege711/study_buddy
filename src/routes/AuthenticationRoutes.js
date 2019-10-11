var express = require("express");
var auth_controller = require("../controllers/AuthenticationController.js");

var router = express.Router();

router.get("/", auth_controller.handleLogIn);
router.get("/login", auth_controller.handleLogIn);

router.post("/register-user", auth_controller.registerUser);

router.post("/login", auth_controller.loginUser);

router.post("/logout", auth_controller.logoutUser);

router.get("/send-validation-email", auth_controller.sendValidationEmailGet);

router.post("/send-validation-email", auth_controller.sendValidationEmailPost);

router.get("/verify-account/*", auth_controller.verifyAccount);

router.get("/reset-password", auth_controller.resetPasswordGet);

router.post("/reset-password", auth_controller.resetPasswordPost);

router.get("/reset-password-link/*", auth_controller.resetPasswordLinkGet);

router.post("/reset-password-link/*", auth_controller.resetPasswordLinkPost);

module.exports = router;