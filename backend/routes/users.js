const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const {
  UserModel,
  validateUser,
  validateProds,
  validateCarts,
  validateChangePassword,
  validateEdit,
} = require("../models/userModel");
const { authToken } = require("../middleware/authToken");
const { ProdModel } = require("../models/prodModel");

const router = express.Router();



router.get("/prods", authToken, async (req, res) => {
  if (!req.query.numbers) {
    res
      .status(400)
      .json({ msg: "You need to send query numbers of real prods" });
  }
  // הייתי מבצע שאילתא ליוזר שמחזיר לי את המערך של הלייקים שלו
  let prodNumbers_ar = req.query.numbers.split(",");
  let prodsData = await ProdModel.find({ prodNumber: { $in: prodNumbers_ar } });
  res.json(prodsData);
});

router.put("/fav", authToken, async (req, res) => {
  let { error } = validateProds(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }
  try {
    const data = await UserModel.updateOne(
      { _id: req.userToken._id },
      { $addToSet: { prods: req.body.prods } }
    );
    if (data.nModified === 0) {
      const data2 = await UserModel.updateOne(
        { _id: req.userToken._id },
        { $pull: { prods: { $in: req.body.prods } } }
      );
      await ProdModel.updateOne(
        { prodNumber: req.body.prods[0] },
        { $inc: { numberFv: -1 } }
      );
      return res.json(data2);
    }
    /// increase the number of favorites in prod
    await ProdModel.updateOne(
      { prodNumber: req.body.prods[0] },
      { $inc: { numberFv: +1 } }
    );
    res.json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.put("/my-cart", authToken, async (req, res) => {
  let { error } = validateCarts(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }
  try {
    const data = await UserModel.updateOne(
      { _id: req.userToken._id },
      { $addToSet: { carts: req.body.carts } }
    );
    if (data.nModified === 0) {
      const data2 = await UserModel.updateOne(
        { _id: req.userToken._id },
        { $pull: { carts: { $in: req.body.carts } } }
      );
      return res.json(data2);
    }
    res.json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.get("/me", authToken, async (req, res) => {
  // יציג את כל המאפיינים מלבד הסיסמא שקיבלה 0
  let userData = await UserModel.findOne(
    { _id: req.userToken._id },
    { password: 0 }
  );
  res.json(userData);
});

router.post("/", async (req, res) => {
  // עשו דיסטקרשין לאובייקט שמקבלים , וישר בודקים אם המאפיין אירור קיים

  let { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  // נעשה בדיקה אם האימייל קיים , כדי לחסוך את פעולת ההצפנה
  // במידה והוא קיים וישר נחזיר הודעת שגיאה
  try {
    let userData = await UserModel.findOne({ email: req.body.email });
    if (userData) {
      return res
        .status(400)
        .json({ err: "user already in system, try log in" });
    }

    // כדי להשתמש בקוד שונה מאשר אינסרט מאני
    // צריך לייצר משתנה שמשתמש בטייפ של המודל החדש ולהעביר לו את האובייקט
    // שנרצה שהוא יהיה עם המאפיינים שלו
    let user = new UserModel(req.body);
    let salt = await bcrypt.genSalt(10);
    // מצפין את המאפיין סיסמא שקיבלנו מ2 שורות למעלה
    user.password = await bcrypt.hash(user.password, salt);
    // פקודה שמקבילה לחלוטין לשורה למעלה בהערה
    await user.save();
    res.json(_.pick(user, ["createdAt", "_id", "name", "email"]));
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err });
  }
});

router.put("/changePassword", authToken, async (req, res) => {
  let { error } = validateChangePassword(req.body);
  if (error) {
    const listErrors = {};
    for (const detail of error.details) {
      listErrors[detail.path[0]] = detail.message;
    }
    return res.status(400).json({ errors: listErrors });
  }

  try {
    const { password } = await UserModel.findOne({ _id: req.userToken._id });
    const validPassword = await bcrypt.compare(req.body.password, password);
    if (!validPassword) {
      return res
        .status(400)
        .json({ errors: { password: "Invalid passsword" } });
    }
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.newPassword, salt);
    const data = await UserModel.updateOne(
      { _id: req.userToken._id },
      {
        password: newPassword,
      }
    );
    res.json(data);
  } catch (err) {
    res.status(400).json({ errors: err });
  }
});

router.put("/edit", authToken, async (req, res) => {
  let { error } = validateEdit(req.body);
  if (error) {
    const listErrors = {};
    for (const detail of error.details) {
      listErrors[detail.path[0]] = detail.message;
    }
    return res.status(400).json({ errors: listErrors });
  }
  try {
    const data = await UserModel.updateOne(
      { _id: req.userToken._id },
      {
        name: req.body.name,
      }
    );
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ errors: err });
  }
});

module.exports = router;
