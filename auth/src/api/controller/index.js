const Handler = require('../../logic/handler/index.js');

class Controller {
	static router = () => {
		const router = require('express').Router();

		router.post('/authorise', Handler.authorise);
		router.put('/unauthorise', Handler.unauthorise);
		router.get('/verify', Handler.verify);

		return router;
	}
}

module.exports = Controller;