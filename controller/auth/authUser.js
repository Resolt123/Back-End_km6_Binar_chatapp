const { login, googleLogin, profile } = require("../../usecase/auth");
const { getTokenFromHeaders, extractToken } = require("../helper/auth");

exports.login = async (req, res, next) => {
  try {
    // get the body
    const { email, password } = req.body;

    if (email == "" || !email) {
      return next({
        message: "Email must be filled!",
        statusCode: 400,
      });
    }
    if (password == "" || !password) {
      return next({
        message: "Password must be filled!",
        statusCode: 400,
      });
    }

    // login logic
    const data = await login(email, password);

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
    const { access_token } = req.body;

    if (!access_token) {
      return next({
        statusCode: 400,
        message: "Access token must be provided!",
      });
    }

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

exports.profile = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req?.headers);

    // extract token to get the user id
    const extractedToken = extractToken(token);

    // get user details by id
    const data = await profile(extractedToken?.id);

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    next(error);
  }
};
