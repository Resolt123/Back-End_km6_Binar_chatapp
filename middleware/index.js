const { ValidationError } = require("sequelize");
const ClientError = require("../exceptions/ClientError");
const InvariantError = require("../exceptions/InvariantError");

const validationHandler = (schema) => (req, res, next) => {
  // Letakkan image ke request body untuk divalidasi
  if (req?.files?.image) {
    const { image } = req.files;
    req.body.image = image;
  }

  const validationResult = schema.validate(req.body);

  if (validationResult.error) {
    throw new InvariantError(validationResult.error.message);
  }

  next();
};

// eslint-disable-next-line consistent-return
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof Error) {
    if (err instanceof ClientError || err instanceof ValidationError) {
      const response = {
        error: {
          message: err.message,
          code: err?.statusCode || 400,
          type: err.name,
        },
      };
      return res.status(err?.statusCode || 400).json(response);
    }

    return res.status(500).json({
      error: {
        message: "There was a failure on our server",
        code: 500,
        type: "ServerError",
      },
    });
  }
  next();
}

module.exports = {
  validationHandler,
  errorHandler,
};
