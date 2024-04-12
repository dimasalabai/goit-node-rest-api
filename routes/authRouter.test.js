import mongoose from "mongoose";
import request from "supertest";

import app from "../app.js";

const { TEST_DB_HOST, PORT = 3000 } = process.env;

describe("test /users/login route", () => {
	let server = null;
	beforeAll(async () => {
		await mongoose.connect(TEST_DB_HOST);
		server = app.listen(PORT);
	});

	afterAll(async () => {
		await mongoose.connection.close();
		server.close();
	});

	test("test /users/login with valid data", async () => {
		const loginData = {
			email: "cat@gmail.com",
			password: 1234578,
		};
		const { statusCode, body } = await request(app)
			.post("/users/login")
			.send(loginData);
		expect(statusCode).toBe(200);
		expect(body.user.email).toBe(loginData.email);
		expect(body.user.subscription).toBe(typeof String);
		expect(body.token).toBe(typeof String);
	});
});
