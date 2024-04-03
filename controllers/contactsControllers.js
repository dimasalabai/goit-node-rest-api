import * as contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/HttpError.js";
import validateBody from "../helpers/validateBody.js";

import {
	createContactSchema,
	updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
	try {
		const { _id: owner } = req.user;

		const { page = 1, limit = 10 } = req.query;
		const skip = (page - 1) * limit;

		const result = await contactsService.getAllContacts(
			{ owner },
			{ skip, limit }
		);

		const total = await contactsService.countContacts({ owner });

		res.json({ contacts: result, total });
	} catch (error) {
		next(error);
	}
};

export const getOneContact = async (req, res, next) => {
	try {
		const { _id: owner } = req.user;
		const { id } = req.params;
		const result = await contactsService.getContactByFilter({ owner, _id: id });
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
		const { _id: owner } = req.user;
		const result = await contactsService.removeContactByFilter({
			owner,
			_id: id,
		});
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

		const { _id: owner } = req.user;
		const result = await contactsService.addContact({ ...req.body, owner });
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
		const { _id: owner } = req.user;
		const result = await contactsService.updateContactByFilter(
			{ owner, _id: id },
			req.body
		);
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
