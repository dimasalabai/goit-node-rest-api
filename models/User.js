import { Schema, model, set } from "mongoose";

import { handleSaveError, setUpdateSettings } from "./hooks.js";

import { emailRegepxp } from "../constants/user-constants.js";

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
		token: {
			type: String,
			default: null,
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post("save", handleSaveError);

userSchema.pre("findByIdAndUpdate", setUpdateSettings);
userSchema.post("findByIdAndUpdate", handleSaveError);

const User = model("user", userSchema);

export default User;
