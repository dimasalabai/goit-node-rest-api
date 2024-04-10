import jwt from "jsonwebtoken";

import HttpError from "../helpers/HttpError.js";

import { findUser } from "../services/authServices.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return next(HttpError(401, "Not authorized"));
	}
	const [barer, token] = authorization.split(" ");
	if (barer !== "Bearer") {
		return next(HttpError(401));
	}

	try {
		const { id } = jwt.verify(token, JWT_SECRET);
		const user = await findUser({ _id: id });
		if (!user) {
			return next(HttpError(401, "User not found"));
		}
		if (!user.token) {
			return next(HttpError(401, "Not authorized"));
		}
		req.user = user;
		next();
	} catch (error) {
		next(HttpError(401, "Not authorized"));
	}
};

export default authenticate;
