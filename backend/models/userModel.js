const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  prods: Array,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  carts: Array,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// בחוברת במקום
// users -> User
// כותב הספר בנה על זה שהמונגוס מוסיף לבד את האס
// אנחנו נעבוד שכתבנו כולל האס
exports.UserModel = mongoose.model("users", userSchema);

////////// Schema Reagex Password
const lowerCaseRegExp = /(?=.*[a-z])/;
const upperCaseRegExp = /(?=.*[A-Z])/;
const numericRegExp = /(?=.*[0-9])/;

exports.validateProds = (_prod) => {
  let schema = Joi.object({
    // min -> אורך המערך במקרה בשורה למטה
    prods: Joi.array().min(1).required(),
  });
  return schema.validate(_prod);
};

exports.validateCarts = (_prod) => {
  let schema = Joi.object({
    // min -> אורך המערך במקרה בשורה למטה
    carts: Joi.array().min(1).required(),
  });
  return schema.validate(_prod);
};

exports.validateUser = (_user) => {
  let schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string()
      .min(6)
      .max(1024)
      .regex(lowerCaseRegExp)
      .regex(upperCaseRegExp)
      .regex(numericRegExp)
      .required(),
    // לא לתת אפשרות למשתמש לבחור אם הוא אדמין
    // admin: Joi.boolean(),
    _id: Joi.string(),
  });

  return schema.validate(_user);
};
exports.validateEdit = (_user) => {
  let schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
  });

  return schema.validate(_user);
};
exports.validateChangePassword = (_passowrd) => {
  let schema = Joi.object({
    password: Joi.string().max(1024).required(),
    newPassword: Joi.string()
      .min(6)
      .max(1024)
      .regex(lowerCaseRegExp)
      .regex(upperCaseRegExp)
      .regex(numericRegExp)
      .required(),
  });

  return schema.validate(_passowrd);
};
