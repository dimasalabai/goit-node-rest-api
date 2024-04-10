import Contact from "../models/Contact.js";

export const getAllContacts = (filter = {}, setting = {}) =>
	Contact.find(filter, "-createAt -updateAt", setting).populate(
		"owner",
		"username email"
	);

export const countContacts = (filter) => Contact.countDocuments(filter);

export const addContact = (data) => Contact.create(data);

export const getContactByFilter = (filter) => Contact.findOne(filter);

export const updateContactByFilter = (filter, data) =>
	Contact.findOneAndUpdate(filter, data, { new: true, runValidators: true });

export const removeContactByFilter = (filter) =>
	Contact.findOneAndDelete(filter);
