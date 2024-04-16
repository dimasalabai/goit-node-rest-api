import express from "express";

import authControllers from "../controllers/authControllers.js";

import {
	userSignInSchema,
	userSignUpSchema,
	userEmailSchema,
} from "../schemas/usersSchemas.js";

import validateBody from "../helpers/validateBody.js";

import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post(
	"/register",
	validateBody(userSignUpSchema),
	authControllers.signup
);

authRouter.get("/verify/:verificationToken", authControllers.verify);
authRouter.post(
	"/verify",
	validateBody(userEmailSchema),
	authControllers.resendVerify
);

authRouter.post(
	"/login",
	validateBody(userSignInSchema),
	authControllers.signin
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.signout);
export default authRouter;

authRouter.patch(
	"/avatars",
	upload.single("avatar"),
	authenticate,
	authControllers.changeAvatar
);
