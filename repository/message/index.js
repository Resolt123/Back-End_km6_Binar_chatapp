const { messages, user } = require("../../models");

exports.getMessages = async () => {
  const data = await messages.findAll({
    include: [
      {
        model: user,
      },
    ],
  });
  return data;
};

exports.createMessage = async (payload) => {
  // Create data to postgres
  const data = await messages.create(payload);

  return data;
};
