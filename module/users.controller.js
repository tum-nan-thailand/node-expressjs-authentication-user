const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const authorize = require("../_middleware/authorize");
const userService = require("./user.service");
const jwt = require("jsonwebtoken");
const config = require("../config");

// routes
router.post("/login", authenticateSchema, authenticate);
router.post("/register", registerSchema, register);
router.get("/", authorize(), getAll);
router.get("/profile", authorize(), getProfile);
router.get("/:id", authorize(), getById);
router.put("/:id", authorize(), updateSchema, update);
router.delete("/:id", authorize(), _delete);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

async function authenticate(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await userService.authenticate({ username, password });
    const token = jwt.sign({ sub: user.id }, config.secret, {
      expiresIn: "1h",
    });
    res.json({ ...omitHash(user), token });
  } catch (error) {
    next(error);
  }
}

function registerSchema(req, res, next) {
  validateRequest(req, next, Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }));
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({ message: "Registration successful" }))
    .catch(next);
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch(next);
}

function getProfile(req, res, next) {
  res.json(req.user);
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => res.json(user))
    .catch(next);
}

function updateSchema(req, res, next) {
  validateRequest(req, next, Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then((user) => res.json(user))
    .catch(next);
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({ message: "User deleted successfully" }))
    .catch(next);
}
function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}
