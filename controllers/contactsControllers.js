import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";

import {
	createContactSchema,
	updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
	try {
		const result = await contactsService.getAllContacts();
		res.json(result);
	} catch (error) {
		next(error);
	}
};

export const getOneContact = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await contactsService.getContactById(id);
		if (!result) {
			throw HttpError(404, `Contact with id = ${id} not found`);
		}

		res.json(result);
	} catch (error) {
		next(error);
	}
};

export const deleteContact = async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await contactsService.removeContact(id);
		if (!result) {
			throw HttpError(404, `Contact with id = ${id} not found`);
		}

		res.json(result);
	} catch (error) {
		next(error);
	}
};

export const createContact = async (req, res, next) => {
	try {
		const { error } = createContactSchema.validate(req.body);
		if (error) {
			throw HttpError(400, error.message);
		}

		const result = await contactsService.addContact(req.body);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

export const updateContact = async (req, res, next) => {
	try {
		if (Object.keys(req.body).length === 0) {
			throw HttpError(400, "Body must have at least one field");
		}

		const { id } = req.params;
		const result = await contactsService.updateContactById(id, req.body);
		if (!result) {
			throw HttpError(404, `Contact with id = ${id} not found`);
		}

		res.json(result);
	} catch (error) {
		next(error);
	}
};

export const updateStatus = async (req, res, next) => {
	try {
		if (Object.keys(req.body).length === 0) {
			throw HttpError(400, "Body must have at least one field");
		}

		const { id } = req.params;

		const result = await contactsService.updateContactById(id, req.body);
		console.log(result);

		if (!result) {
			throw HttpError(404, "Not Found");
		}
		res.json(result);
	} catch (error) {
		next(error);
	}
};
