const express = require('express');
const passport = require('passport');
const router = express.Router();
const {rolAuth} = require('../../../config/auth');
const UserController = require('../../../controllers/UserController');

router.route('/')
    .get(rolAuth, UserController.getUsers);

router.route('/register')
    .post(UserController.newUser);

router.route('/:id')
    .get(UserController.getUser)
    .put(UserController.updateUser)
    .delete(rolAuth, UserController.deleteUser);

router.route('/login')
    .post(passport.authenticate('local'), UserController.userLogin);

router.route('/logout')
    .post(UserController.userLogout);

module.exports = router;