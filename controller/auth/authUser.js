const { login, googleLogin, register } = require("../../usecase/auth");

exports.register = async (req, res, next) => {
  try {
    const user = await register(req.body);

    res.status(201).json({
      message: "Success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    // login logic
    const data = await login(req.body);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.googleLogin = async (req, res, next) => {
  try {
    // get the body
    // eslint-disable-next-line camelcase
    const { access_token } = req.body;

    // login with google logic
    const data = await googleLogin(access_token);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
