import gravatar from "gravatar";

import { Schema, model, set } from "mongoose";

import { handleSaveError, setUpdateSettings } from "./hooks.js";

import { emailRegepxp } from "../constants/user-constants.js";

const generateAvatarUrl = function () {
	return gravatar.url(this.email);
};

const userSchema = new Schema(
	{
		email: {
			type: String,
			match: emailRegepxp,
			unique: true,
			required: [true, "Email is required"],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		avatarURL: {
			type: String,
			default: generateAvatarUrl,
		},
		token: {
			type: String,
			default: null,
		},
		verify: {
			type: Boolean,
			default: false,
		},
		verificationToken: {
			type: String,
			required: [true, "Verify token is required"],
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findByIdAndUpdate", setUpdateSettings);
userSchema.post("findByIdAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
