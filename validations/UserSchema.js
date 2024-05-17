const Joi = require("joi");

const userRegisterSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  image: Joi.object({
    mimetype: Joi.string()
      .valid(
        "image/apng",
        "image/avif",
        "image/gif",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      )
      .required(),
  })
    .required()
    .unknown(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userGoogleLoginSchema = Joi.object({
  access_token: Joi.string().required(),
});

module.exports = {
  userLoginSchema,
  userRegisterSchema,
  userGoogleLoginSchema,
};
