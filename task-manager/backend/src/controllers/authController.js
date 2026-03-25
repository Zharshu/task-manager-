const authService = require('../services/authService');

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.signup({ name, email, password, role });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getMe = (req, res) => {
  res.json({ user: req.user });
};

module.exports = { signup, login, getMe };
