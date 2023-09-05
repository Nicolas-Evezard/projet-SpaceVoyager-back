const Joi = require("joi");

const insert = Joi.object({
  person: Joi.number().integer(),
  total_price: Joi.number().integer(),
  hostel_id: Joi.number().integer(),
  room_id: Joi.number().integer(),
  dp_date: Joi.string()
    .pattern(
      new RegExp("^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$")
    )
    .required(),
  cb_date: Joi.string()
    .pattern(
      new RegExp("^(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$")
    )
    .required(),
  planet_id: Joi.number().integer(),
  user_id: Joi.number().integer(),
}).required();

module.exports = {
  insert,
};
