const mongoose = require("mongoose");
const Joi = require("joi");

const prodsSchema = new mongoose.Schema({
  prodName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  prodDescription: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  prodImage: {
    type: String,
    required: true,
    minlength: 11,
    maxlength: 1024,
  },
  prodNumber: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 99999999999,
  },
  prodPrice: {
    type: Number,
    required: true,
    minlength: 1,
  },
  prodStock: {
    type: Number,
    required: true,
    minlength:0,
  },
  prodCat: {
    type: String,
    required: true,
    minlength: 1,
  },
  numberFv: {
    type: Number,
    default: 0,
  },
  // הטייפ אומר שזה מסוג איי די של מונגו
  // והריף בעצם מרמז שזה מפתח זר מקולקשן יוזר
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

exports.ProdModel = mongoose.model("products", prodsSchema);

// דואג להביא מספר רנדומלי ותמיד בודק שהוא לא במסד נתונים
// ואם כן יביא אחד אחר עד שהוא ימצא אחד שלא קיים
exports.generateProdNumber = async (ProdModel) => {
  // ישאר בלולאה עד שלא ימצא מספר רנדומלי שלא קיים
  while (true) {
    let randomNumber = Math.floor(Math.random() * 899000) + 100000;
    let prod = await ProdModel.findOne({ prodNumber: randomNumber });
    // אם לא מוצא את המספר במסד נתונים יחזיר אותו
    if (!prod) {
      return String(randomNumber);
    }
  }
};

exports.validateProd = (_prod) => {
  const schema = Joi.object({
    prodName: Joi.string().min(2).max(255).required(),
    prodDescription: Joi.string().min(2).max(1024).required(),
    prodPrice: Joi.number().min(1).required(),
    prodImage: Joi.string().min(11).max(1024).required(),
    prodStock: Joi.number().min(0).required(),
    prodCat: Joi.string().min(1).required(),
    _id: Joi.string(),
  });

  return schema.validate(_prod);
};
