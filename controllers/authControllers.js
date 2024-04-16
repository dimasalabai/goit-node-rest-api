import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

import Jimp from "jimp";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../decorators/ctrlWrapper.js";

import HttpError from "../helpers/HttpError.js";
import sendEmail from "../helpers/sendEmail.js";

const { JWT_SECRET, PROJECT_URL } = process.env;

const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
	const { email, password } = req.body;

	const user = await authServices.findUser({ email });
	if (user) {
		throw HttpError(409, "Email already in use");
	}

	const hashPassword = await bcrypt.hash(password, 10);
	const verificationToken = nanoid();

	const newUser = await authServices.signup({
		...req.body,
		password: hashPassword,
		verificationToken,
	});

	const verifyEmail = {
		to: email,
		subject: "verify email",
		html: `<a target="_blank" href="${PROJECT_URL}/users/verify/${verificationToken}">Click to verify</a>`,
	};
	await sendEmail(verifyEmail);

	res.status(201).json({
		user: { email: newUser.email, subscription: newUser.subscription },
	});
};

const verify = async (req, res) => {
	const { verificationToken } = req.params;
	const user = await authServices.findUser({ verificationToken });
	console.log(user);
	if (!user) {
		throw HttpError(404, "User not found");
	}
	await authServices.updateUser(
		{ _id: user.id },
		{ verify: true, verificationToken: null }
	);
	res.status(200).json({
		message: "Verification successful",
	});
};

const resendVerify = async (req, res) => {
	const { email } = req.body;
	const user = await authServices.findUser({ email });
	if (!user) {
		throw HttpError(404, "Email not found");
	}
	if (user.verify) {
		throw HttpError(400, "Email already verify");
	}

	const verifyEmail = {
		to: email,
		subject: "verify email",
		html: `<a target="_blank" href="${PROJECT_URL}/users/verify/${user.verificationToken}">Click to verify</a>`,
	};
	await sendEmail(verifyEmail);
	res.json({
		message: "Verification email sent",
	});
};

const signin = async (req, res) => {
	const { email, password } = req.body;

	const user = await authServices.findUser({ email });
	if (!user) {
		throw HttpError(401, "Email or password invalid");
	}

	if (!user.verify) {
		throw HttpError(401, "Email not verify");
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
	verify: ctrlWrapper(verify),
	resendVerify: ctrlWrapper(resendVerify),
	signin: ctrlWrapper(signin),
	getCurrent: ctrlWrapper(getCurrent),
	signout: ctrlWrapper(signout),
	changeAvatar: ctrlWrapper(changeAvatar),
};
