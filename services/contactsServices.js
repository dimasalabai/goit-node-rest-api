import { nanoid } from "nanoid";

import fs from "fs/promises";
import path from "path";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = (contacts) =>
	fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export const getAllContacts = async () => {
	const contactsList = await fs.readFile(contactsPath);

	return JSON.parse(contactsList);
};

export const getContactById = async (contactId) => {
	const contacts = await getAllContacts();
	const result = contacts.find((item) => item.id === contactId);

	return result || null;
};

export const removeContact = async (contactId) => {
	const contacts = await getAllContacts();
	const contactIndex = contacts.findIndex((item) => item.id === contactId);
	if (contactIndex === -1) {
		return null;
	}
	const [deletedContact] = contacts.splice(contactIndex, 1);
	await updateContacts(contacts);

	return deletedContact;
};

export const addContact = async (data) => {
	const contacts = await getAllContacts();
	const newContact = {
		id: nanoid(),
		...data,
	};

	contacts.push(newContact);
	await updateContacts(contacts);

	return newContact;
};

export const updateContactById = async (id, data) => {
	const contacts = await getAllContacts();
	const index = contacts.findIndex((item) => item.id === id);
	if (index === -1) {
		return null;
	}
	contacts[index] = { ...contacts[index], ...data };
	await updateContacts(contacts);

	return contacts[index];
};
