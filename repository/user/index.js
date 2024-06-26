/* eslint-disable no-param-reassign */
const crypto = require("crypto");
const path = require("path");
const axios = require("axios");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { user } = require("../../models");
const { uploader } = require("../../helper/cloudinary");
const { getData, setData } = require("../../helper/redis");
const { InvariantError, NotFoundError } = require("../../exceptions");

exports.createUser = async (payload) => {
  try {
    // encrypt the password
    payload.password = bcrypt.hashSync(payload.password, 10);

    if (payload.image) {
      // upload image to cloudinary
      const { image } = payload;

      // make unique filename -> 213123128uasod9as8djas
      image.publicId = crypto.randomBytes(16).toString("hex");

      // rename the file -> 213123128uasod9as8djas.jpg / 213123128uasod9as8djas.png
      image.name = `${image.publicId}${path.parse(image.name).ext}`;

      // Process to upload image
      const imageUpload = await uploader(image);
      payload.image = imageUpload.secure_url;
    }

    if (payload?.picture) {
      payload.image = payload?.picture;
    }

    // save to db
    const data = await user.create({ id: uuidv4(), ...payload });

    // save to redis (email and id)
    const keyID = `user:${data.id}`;
    await setData(keyID, data, 300);

    const keyEmail = `user:${data.email}`;
    await setData(keyEmail, data, 300);

    return data;
  } catch (error) {
    console.error(error);
    throw new InvariantError("Failed to create user!");
  }
};

exports.getUserByEmail = async (email, returnError) => {
  const key = `user:${email}`;

  // get from redis
  let data = await getData(key);
  if (data) {
    return data;
  }

  // get from db
  data = await user.findAll({
    where: {
      email,
    },
  });
  if (data.length > 0) {
    // save to redis
    await setData(key, data[0], 300);

    return data[0];
  }

  if (returnError) {
    throw new NotFoundError(`User is not found!`);
  }

  return null;
};

exports.checkUsernameAvailability = async (username) => {
  const userData = await user.findOne({
    where: {
      username,
    },
  });

  if (userData) {
    throw new InvariantError("Username is already in use!");
  }
};

exports.checkEmailAvailability = async (email) => {
  const userData = await user.findOne({
    where: {
      email,
    },
  });

  if (userData) {
    throw new InvariantError("Email is already in use!");
  }
};

exports.getGoogleAccessTokenData = async (accessToken) => {
  const response = await axios.get(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
  );
  return response.data;
};

exports.getUserByID = async (id) => {
  const key = `user:${id}`;

  // get from redis
  let data = await getData(key);
  if (data) {
    return data;
  }

  // get from db
  data = await user.findAll({
    where: {
      id,
    },
  });
  if (data.length > 0) {
    // save to redis
    await setData(key, data[0], 300);

    return data[0];
  }

  throw new Error(`User is not found!`);
};

exports.editProfile = async (payload) => {
  if (payload.image) {
    // upload image to cloudinary
    const { image } = payload;

    // make unique filename -> 213123128uasod9as8djas
    image.publicId = crypto.randomBytes(16).toString("hex");

    // rename the file -> 213123128uasod9as8djas.jpg / 213123128uasod9as8djas.png
    image.name = `${image.publicId}${path.parse(image.name).ext}`;

    // Process to upload image
    const imageUpload = await uploader(image);
    payload.image = imageUpload.secure_url;
  }

  const data = await user.update(payload, {
    where: {
      id: payload.id,
    },
  });

  const updatedUser = await user.findOne({
    where: {
      id: payload.id,
    },
  });

  // save to redis (email and id)
  const keyID = `user:${updatedUser.id}`;
  await setData(keyID, updatedUser, 300);

  const keyEmail = `user:${updatedUser.email}`;
  await setData(keyEmail, updatedUser, 300);
  return updatedUser;
};
