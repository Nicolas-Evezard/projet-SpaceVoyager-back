// REQUIRE MODULES
const Joi = require("joi");

//JOI SCHEMA FOR INSERT A USER
const insert = Joi.object({
  firstname: Joi.string().pattern(new RegExp("^[a-zA-Z]+$"))
  .min(3)
  .max(40)
  .required(),
  lastname: Joi.string().pattern(new RegExp("^[a-zA-Z]+$"))
  .min(3)
  .max(40)
  .required(),
  mail: Joi.string()
  .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "fr"] } })
  .min(10)
  .max(50)
  .required(),
  password: Joi.string()
  .pattern(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&\.,])[A-Za-z\d@$!%*#?&\.,]{8,}$/
  )
  .max(40)
  .required(),
}).required();

//JOI SCHEMA FOR UPDATE A USER
const update = Joi.object({
  id: Joi.number().integer(),
  firstname: Joi.string().pattern(new RegExp("^[a-zA-Z]+$"))
  .min(3)
  .max(40),
  lastname: Joi.string().pattern(new RegExp("^[a-zA-Z]+$"))
  .min(3)
  .max(40),
  mail: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "fr"] },
})
  .min(10)
  .max(50),
})
  .min(1)
  .required();

module.exports = {
  insert,
  update,
};
