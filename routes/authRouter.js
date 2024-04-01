import express from "express";

import authControllers from "../controllers/authControllers.js";

import { userSignInSchema, userSignUpSchema } from "../schemas/usersSchemas.js";

import validateBody from "../helpers/validateBody.js";

import authentificate from "../middlewares/authenticate.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
	"/signup",
	validateBody(userSignUpSchema),
	authControllers.signup
);
authRouter.post(
	"/signin",
	validateBody(userSignInSchema),
	authControllers.signin
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/signout", authenticate, authControllers.signout);
export default authRouter;
