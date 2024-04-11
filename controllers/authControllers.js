import fs from "fs/promises";
import path from "path";

import Jimp from "jimp";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
	const { email, password } = req.body;

	const user = await authServices.findUser({ email });
	if (user) {
		throw HttpError(409, "Email already in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const newUser = await authServices.signup({
		...req.body,
		password: hashPassword,
	});

	res.status(201).json({
		user: { email: newUser.email, subscription: newUser.subscription },
	});
};

const signin = async (req, res) => {
	const { email, password } = req.body;

	const user = await authServices.findUser({ email });
	if (!user) {
		throw HttpError(401, "Email or password invalid");
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, "Email or password invalid");
	}

	const { _id: id } = user;
	const payload = {
		id,
	};

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
	await authServices.updateUser({ _id: id }, { token });

	res.json({
		token,
		user: {
			email: email,
			subscription: user.subscription,
		},
	});
};

const getCurrent = async (req, res) => {
	const { subscription, email } = req.user;

	res.json({
		email,
		subscription,
	});
};

const signout = async (req, res) => {
	const { _id } = req.user;
	await authServices.updateUser({ _id }, { token: "" });

	res.status(204).json();
};

const changeAvatar = async (req, res) => {
	const { avatarURL, _id } = req.user;

	const { path: oldPath, filename } = req.file;

	Jimp.read(oldPath, (err, newAvatar) => {
		if (err) throw err;
		newAvatar.resize(250, 250); // resize
		const newPath = path.join(avatarPath, filename);
		newAvatar.write(newPath); // save
	});

	const newPath = path.join(avatarPath, filename);
	await fs.rename(oldPath, newPath);

	const avatar = path.join("avatars", filename);

	await authServices.updateUser({ _id }, { avatarURL: avatar });

	res.status(200).json({
		avatarURL: avatar,
	});
};

export default {
	signup: ctrlWrapper(signup),
	signin: ctrlWrapper(signin),
	getCurrent: ctrlWrapper(getCurrent),
	signout: ctrlWrapper(signout),
	changeAvatar: ctrlWrapper(changeAvatar),
};
