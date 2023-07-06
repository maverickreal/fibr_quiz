const router = require('express').Router();
const { auth } = require('../models/token.js');
const handles = require('../handlers/main.js');

router.post('/api/signup', handles.postSignup);
router.post('/api/signin', handles.postSignin);
router.post('/api/signout', auth, handles.postSignout);
router.put('/api/user', auth, handles.putUser, handles.postSignout);
router.put('/api/password', auth, handles.putPassword, handles.postSignout);

module.exports = router;