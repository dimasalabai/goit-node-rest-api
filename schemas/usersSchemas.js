import Joi from "joi";

import { emailRegepxp } from "../constants/user-constants.js";

export const userSignUpSchema = Joi.object({
	username: Joi.string().required(),
	email: Joi.string().pattern(emailRegepxp).required(),
	password: Joi.string().min(6).required(),
});

export const userSignInSchema = Joi.object({
	email: Joi.string().pattern(emailRegepxp).required(),
	password: Joi.string().min(6).required(),
});
