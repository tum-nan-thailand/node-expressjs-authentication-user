const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../../_middleware/validate-request');
const authorize = require('../../_middleware/authorize');
const userService = require('./user.service');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');

// routes
router.post('/authenticate', authenticateSchema, authenticate);
router.post('/register', registerSchema, register);
router.get('/', authorize(), getAll);
router.get('/current', authorize(), getCurrent);
router.get('/:id', authorize(), getById);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

async function authenticate(req, res, next) {
    try {
        const { username, password } = req.body;
        const user = await userService.authenticate({ username, password });
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '1h' });
        res.json({ ...omitHash(user), token });
    } catch (error) {
        next(error);
    }
}

function registerSchema(req, res, next) {
    const schema = Joi.object({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users.map(u => omitHash(u))))
        .catch(next);
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => res.json(omitHash(user)))
        .catch(next);
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => res.json(omitHash(user)))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        firstname: Joi.string().empty(''),
        lastname: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(user => res.json(omitHash(user)))
        .catch(next);
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: 'User deleted successfully' }))
        .catch(next);
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}
