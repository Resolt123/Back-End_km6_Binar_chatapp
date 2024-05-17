const { messages } = require("../../models");

exports.getMessages = async () => {
  const data = await messages.findAll();
  return data;
};

exports.createMessage = async (payload) => {
  // Create data to postgres
  const data = await messages.create(payload);

  return data;
};
