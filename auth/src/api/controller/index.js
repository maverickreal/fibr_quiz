const Handler = require('../../logic/handler/index.js');

class Controller {
	static router = () => {
		const router = require('express').Router();

		router.post('/authorise', Handler.authorise);
		router.delete('/unauthorise', Handler.unauthorise);
		router.get('/authenticate', Handler.authenticate);

		return router;
	}
}

module.exports = Controller;