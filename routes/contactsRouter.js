import express from "express";
import {
	getAllContacts,
	getOneContact,
	deleteContact,
	createContact,
	updateContact,
	updateStatus,
} from "../controllers/contactsControllers.js";

import {
	updateContactSchema,
	updateStatusContactShema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(updateContactSchema), createContact);

contactsRouter.put(
	"/:id",
	isValidId,
	validateBody(updateContactSchema),
	updateContact
);

contactsRouter.patch(
	"/:id/favorite",
	validateBody(updateStatusContactShema),
	isValidId,
	updateStatus
);

export default contactsRouter;
