"use strict";
/**
 * @description Provide routes related to authenticating users.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AuthenticationController_1 = require("../controllers/AuthenticationController");
/**
 * A AuthenticationRouter with routes for registering users, logging in users, processing
 * account validation emails and processing password resets.
 */
var AuthenticationRouter = express_1.Router();
exports.AuthenticationRouter = AuthenticationRouter;
AuthenticationRouter.get("/", AuthenticationController_1.handleLogIn);
AuthenticationRouter.get("/login", AuthenticationController_1.handleLogIn);
AuthenticationRouter.post("/register-user", AuthenticationController_1.registerUser);
AuthenticationRouter.post("/login", AuthenticationController_1.loginUser);
AuthenticationRouter.post("/logout", AuthenticationController_1.logoutUser);
AuthenticationRouter.get("/send-validation-email", AuthenticationController_1.sendValidationEmailGet);
AuthenticationRouter.post("/send-validation-email", AuthenticationController_1.sendValidationEmailPost);
AuthenticationRouter.get("/verify-account/*", AuthenticationController_1.verifyAccount);
AuthenticationRouter.get("/reset-password", AuthenticationController_1.resetPasswordGet);
AuthenticationRouter.post("/reset-password", AuthenticationController_1.resetPasswordPost);
AuthenticationRouter.get("/reset-password-link/*", AuthenticationController_1.resetPasswordLinkGet);
AuthenticationRouter.post("/reset-password-link/*", AuthenticationController_1.resetPasswordLinkPost);
//# sourceMappingURL=AuthenticationRoutes.js.map