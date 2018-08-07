var express = require("express");
var auth_controller = require("../controllers/AuthenticationController.js");

var router = express.Router();

router.get("/", auth_controller.handleLogIn);
router.get("/login", auth_controller.handleLogIn);

router.post("/register-user", auth_controller.register_user);

router.post("/login", auth_controller.login);

router.post("/logout", auth_controller.logout);

router.get("/send-validation-email", auth_controller.send_validation_email_get);

router.post("/send-validation-email", auth_controller.send_validation_email_post);

router.get("/verify-account/*", auth_controller.verify_account);

router.get("/reset-password", auth_controller.reset_password_get);

router.post("/reset-password", auth_controller.reset_password_post);

router.get("/reset-password-link/*", auth_controller.reset_password_link_get);

router.post("/reset-password-link/*", auth_controller.reset_password_link_post);

module.exports = router;