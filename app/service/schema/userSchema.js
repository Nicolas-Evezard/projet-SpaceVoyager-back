const Joi = require("joi");

const insert = Joi.object({
  firstname: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).required(),
  lastname: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")).required(),
  mail: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "fr"] } })
    .required(),
  password: Joi.string()
    .pattern(
      new RegExp("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=!])(.{8,})$")
    )
    .required(),
}).required();

const update = Joi.object({
  id: Joi.number().integer(),
  firstname: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")),
  lastname: Joi.string().pattern(new RegExp("^[a-zA-Z]+$")),
  mail: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "fr"] },
  }),
})
  .min(1)
  .required();

module.exports = {
  insert,
  update,
};
