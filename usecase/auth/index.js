const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  createUser,
  getUserByEmail,
  getUserByID,
  getGoogleAccessTokenData,
  checkUsernameAvailability,
  checkEmailAvailability,
  editProfile,
} = require("../../repository/user");
const { createToken } = require("./utils");
const { InvariantError, NotFoundError } = require("../../exceptions");
const { picture } = require("../../config/cloudinary");

exports.register = async (payload) => {
  // Check unique username
  await checkUsernameAvailability(payload.username);
  // Check unique email
  await checkEmailAvailability(payload.email);
  // create user
  const user = await createUser(payload);
  return user;
};

exports.login = async ({ email, password }) => {
  // get the user
  const user = await getUserByEmail(email);
  if (!user) {
    throw new NotFoundError(`User is not found!`);
  }

  // compare the password
  const isValid = await bcrypt.compare(password, user?.password);
  if (!isValid) {
    throw new InvariantError(`Wrong password!`);
  }

  // delete password
  if (user?.dataValues?.password) {
    delete user?.dataValues?.password;
  } else {
    delete user?.password;
  }

  // Create token
  const jwtPayload = {
    id: user.id,
  };

  const token = jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // return the user data and the token
  const data = {
    user,
    token,
  };

  return data;
};

exports.googleLogin = async (accessToken) => {
  // validate the token and get the data from google
  const googleData = await getGoogleAccessTokenData(accessToken);
  const randomString = Math.random().toString(36).substring(2, 7);

  // get is there any existing user with the email
  let user = await getUserByEmail(googleData?.email);

  // if not found
  if (!user) {
    // Create new user based on google data that get by access_token
    user = await createUser({
      email: googleData?.email,
      username: googleData?.email.split("@")[0] + randomString,
      name: googleData?.name,
      password: "",
      picture: googleData?.picture,
    });
  }

  // Delete object password from user
  delete user?.dataValues?.password;

  // create token
  const data = createToken(user);

  return data;
};

exports.profile = async (id) => {
  // get the user
  let data = await getUserByID(id);
  if (!data) {
    throw new Error(`User is not found!`);
  }

  // delete password
  if (data?.dataValues?.password) {
    delete data?.dataValues?.password;
  } else {
    delete data?.password;
  }

  return data;
};

exports.editProfile = async (payload) => {
  // get the user
  let user = await getUserByID(payload.id);
  if (!user) {
    throw new NotFoundError(`User is not found!`);
  }

  // update the user
  user = await editProfile(payload);

  // delete password
  if (user?.dataValues?.password) {
    delete user?.dataValues?.password;
  } else {
    delete user?.password;
  }

  return user;
};
