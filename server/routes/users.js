const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const authMiddleware = require("../middlewares/authMiddleware");


/* POST register new user. */
router.post('/registerStep1', [authMiddleware.isGuest], usersController.registerStep1);
router.post('/registerStep2', [authMiddleware.isGuest], usersController.registerStep2);
/* POST login. */
router.post('/login', [authMiddleware.isGuest], usersController.login);


// System -----------------------------------------------------------------------------------------------
/* GET cities list - (System require) */
router.get('/cities', usersController.getCities)


module.exports = router;
