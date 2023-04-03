const config = require('../../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../_helpers/db');

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function authenticate(req, res, next) {
  const { username, password } = req.body;

  const user = await db.User.scope('withHash').findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.hash))) {
    return res.status(400).json({ message: 'Username or password is incorrect' });
  }

  const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '1h' });
  const { hash, ...userWithoutHash } = user.get();

  res.json({ ...userWithoutHash, token });
}

async function getAll(req, res, next) {
  const users = await db.User.findAll();
  res.json(users);
}

async function getById(req, res, next) {
  const user = await getUser(req.params.id);
  res.json(user);
}

async function create(req, res, next) {
  const { username, password } = req.body;

  // validate
  if (await db.User.findOne({ where: { username } })) {
    return res.status(400).json({ message: `Username "${username}" is already taken` });
  }

  const user = await db.User.create({
    username,
    hash: await bcrypt.hash(password, 10),
    roleId: 1,
  });

  const { hash, ...userWithoutHash } = user.get();

  res.json(userWithoutHash);
}

async function update(req, res, next) {
  const user = await getUser(req.params.id);

  const { username, password } = req.body;

  // validate
  const usernameChanged = username && user.username !== username;
  if (usernameChanged && await db.User.findOne({ where: { username } })) {
    return res.status(400).json({ message: `Username "${username}" is already taken` });
  }

  // hash password if it was entered
  if (password) {
    user.hash = await bcrypt.hash(password, 10);
  }

  Object.assign(user, { username });
  await user.save();

  const { hash, ...userWithoutHash } = user.get();
  res.json(userWithoutHash);
}

async function _delete(req, res, next) {
  const user = await getUser(req.params.id);
  await user.destroy();
  res.json({ message: 'User deleted successfully' });
}

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw 'User not found';
  return user;
}
