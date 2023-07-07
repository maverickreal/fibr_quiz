const Hash = require('../utility/hash.js'),
	User = require('../models/user.js'),
	{ checkAge, checkEmail, checkPassword, checkPhoneNumber } = require('../utility/creds.js'),
	{ v4: uuid } = require('uuid'),
	db = require('../data/main.js'),
	{ invalidate, assignToken } = require('../models/token.js'),
	container = require('../di/main.js');

class Handler {
	static #errorAndLog = (err, res) => {
		console.log(err);
		res.status(500).send();
	}
	static async postSignup(req, res) {
		try {
			const user = new User(req.body);
			if (!(user.firstName && user.lastName && user.age && user.email && user.phoneNumber && user.password)) {
				return res.status(400).send({
					message: 'signup information not provided'
				});
			}
			if (!checkPassword(user.password)) {
				return res.status(400).send({
					message: 'weak password'
				});
			}
			if (!checkEmail(user.email)) {
				return res.status(400).send({
					message: 'invalid email address'
				});
			}
			if (!checkPhoneNumber(user.phoneNumber)) {
				return res.status(400).send({
					message: 'invalid age'
				});
			}
			if (!checkAge(user.age)) {
				return res.status(400).send({
					message: 'invalid phone number'
				});
			}
			if ((await db.verifyCredentials(user)) === true) {
				return res.status(400).send({
					message: 'credentials already in use'
				});
			}
			user.userId = uuid();
			const hps = await db.createUser(user);
			if (!hps) {
				return Handler.#errorAndLog(null, res);
			}
			user.password = hps.password, user.salt = hps.salt;
			assignToken(user);
			res.status(200).send({ token: user.token });
		}
		catch (error) {
			Handler.#errorAndLog(error, res);
		}
	}

	static async postSignin(req, res) {
		try {
			const { email, password } = req.body;
			if (!email || !password) {
				return res.status(400).send({
					message: 'login information not provided'
				});
			}
			const data= await db.userExists(email, password);
			if (!data) {
				return Handler.#errorAndLog(null, res);
			}
			const user = new User(data);
			assignToken(user);
			res.status(200).send({ token: user.token });
		}
		catch (error) {
			Handler.#errorAndLog(error, res);
		}
	}

	static async postSignout(req, res) {
		invalidate(req.user.userId);
		res.status(200).send({ status: 'ok' });
	}

	static async putUser(req, res, next) {
		try {
			const user = {},
				encFieldsSet = container.resolve('encryptedFields'),
				allowedFields = container.resolve('allowedUpdates'),
				crypt = container.resolve('crypt');

			for (const field of allowedFields) {
				if (req.body[field]) {
					let val = req.body[field];
					if (encFieldsSet.has(field)) {
						val = crypt.encrypt(val);
					}
					user[field] = val;
				}
			}
			const error = await db.updateUser(req.user.userId, user);
			if (error) {
				return Handler.#errorAndLog(error, res);
			}
			next();
		}
		catch (error) {
			Handler.#errorAndLog(error, res);
		}
	}

	static async putPassword(req, res, next) {
		try {
			const { oldPassword, newPassword } = req.body;
			if (!oldPassword || !newPassword) {
				return res.status(400).send({ status: 'error', message: 'Either or both of old and new passwords are missing!' });
			}
			if (!checkPassword(newPassword)) {
				return res.status(400).send({
					status: 'error',
					message: 'weak password'
				});
			}
			const correctPasswordProvided = await Hash.check(oldPassword, req.user.salt, req.user.password);
			if (!correctPasswordProvided) {
				return res.status(400).send({ status: 'error', message: 'wrong current password provided' });
			}
			const error = await db.updatePassword(req.user, newPassword);
			if (error) {
				return Handler.#errorAndLog(error, res);
			}
			next();
		}
		catch (error) {
			Handler.#errorAndLog(error, res);
		}
	}
}

module.exports = Handler;