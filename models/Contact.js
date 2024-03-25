import { Schema, model, set } from "mongoose";

import { handleSaveError, setUpdateSettings } from "./hooks.js";

const contactSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Set name for contact"],
		},
		email: {
			type: String,
			required: true,
		},
		phone: {
			type: String,
			required: true,
		},
		favorite: {
			type: Boolean,
			default: false,
		},
	},
	{ versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);

// contactSchema.pre("findByIdAndUpdate", setUpdateSettings);
// contactSchema.post("findByIdAndUpdate", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
