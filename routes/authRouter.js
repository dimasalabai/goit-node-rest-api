import express from "express";

import authControllers from "../controllers/authControllers.js";

import { userSignInSchema, userSignUpSchema } from "../schemas/usersSchemas.js";

import validateBody from "../helpers/validateBody.js";

import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
	"/register",
	validateBody(userSignUpSchema),
	authControllers.signup
);
authRouter.post(
	"/login",
	validateBody(userSignInSchema),
	authControllers.signin
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.signout);
export default authRouter;
