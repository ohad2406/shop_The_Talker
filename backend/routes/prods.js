const express = require("express");
const { authToken } = require("../middleware/authToken");
const {
  ProdModel,
  validateProd,
  generateProdNumber,
} = require("../models/prodModel");
const { UserModel } = require("../models/userModel");

const router = express.Router();

router.get("/:prodType/gender", async (req, res) => {
  let PerPage = req.query.perPage ? Number(req.query.perPage) : 12;
  let page = req.query.page ? req.query.page * PerPage : 0;

  let sortBy = req.query.sort ? req.query.sort : "_id";
  //ASC -> קטן לגדול DESC -> גדול לקטן
  let sortOrder = req.query.reverse == "true" ? -1 : 1;
  try {
    if (req.params.prodType === "man") {
      let prodData = await ProdModel.find({ prodCat: "man" })
        .limit(PerPage)
        .skip(page)
        .sort({ [sortBy]: sortOrder });
      const docsSum = await ProdModel.countDocuments({ prodCat: "man" });
      return res.json({
        page: req.query.page,
        numOfPages: parseFloat(docsSum / PerPage),
        prodData,
      });
    }
    if (req.params.prodType === "woman") {
      let prodData = await ProdModel.find({ prodCat: "woman" })
        .limit(PerPage)
        .skip(page)
        .sort({ [sortBy]: sortOrder });
      const docsSum = await ProdModel.countDocuments({ prodCat: "woman" });
      return res.json({
        page: req.query.page,
        numOfPages: parseFloat(docsSum / PerPage),
        prodData,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

router.get("/search", async (req, res) => {
  let PerPage = req.query.perPage ? req.query.perPage : 12;
  let page = req.query.page ? req.query.page * PerPage : 0;
  let prodName = req.query.prodName;

  let expSearchQ = new RegExp(prodName, "i");

  let sortBy = req.query.sort ? req.query.sort : "_id";
  //ASC -> קטן לגדול DESC -> גדול לקטן
  let sortOrder = req.query.reverse == "true" ? -1 : 1;
  try {
    if (req.query.prodType === "man") {
      let prodData = await ProdModel.find({
        prodCat: "man",
        prodName: expSearchQ,
      })
        .limit(PerPage)
        .skip(page)
        .sort({ [sortBy]: sortOrder });
      const docsSum = await ProdModel.countDocuments({
        prodCat: "man",
        prodName: expSearchQ,
      });
      return res.json({
        page: req.query.page,
        numOfPages: parseFloat(docsSum / PerPage),
        prodData,
      });
    } else if (req.query.prodType === "woman") {
      let prodData = await ProdModel.find({
        prodCat: "woman",
        prodName: expSearchQ,
      })
        .limit(PerPage)
        .skip(page)
        .sort({ [sortBy]: sortOrder });
      const docsSum = await ProdModel.countDocuments({
        prodCat: "woman",
        prodName: expSearchQ,
      });
      return res.json({
        page: req.query.page,
        numOfPages: parseFloat(docsSum / PerPage),
        prodData,
      });
    } else {
      return res.send("no found resulat");
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

router.get("/:id", async (req, res) => {
  let prodData = await ProdModel.findOne({ _id: req.params.id });
  res.json(prodData);
});

router.get("/", async (req, res) => {
  let PerPage = 12;
  let page = req.query.page ? req.query.page * PerPage : 0;

  let sortBy = req.query.sort ? req.query.sort : "_id";
  //ASC -> קטן לגדול DESC -> גדול לקטן
  let sortOrder = req.query.reverse == "true" ? -1 : 1;

  // SELECT * FROM yads LIMIT 0,2;
  try {
    const data = await ProdModel.find({})
      .limit(PerPage)
      .skip(page)
      // בברירת מחדל מחפש את העמודה שנקראת סורט ביי ואנחנו רוצים
      // שיחפש את העמודה של הסטרינג שנמצא במשתנה סורט ביי
      // אז כדי לפתור את הבעיה נכתוב את השם של המשתנה בתוך סוגריים מרובעים
      .sort({ [sortBy]: sortOrder });
    const docsSum = await ProdModel.countDocuments({});
    return res.json({
      page: req.query.page,
      numOfPages: parseFloat(docsSum / PerPage),
      data,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
});

router.post("/", authToken, async (req, res) => {
  let { error } = validateProd(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  // Check if the user is admin or not
  let userData = await UserModel.findOne(
    { _id: req.userToken._id },
    { password: 0 }
  );
  if (userData.admin != true) {
    return res
      .status(400)
      .json("You don't have permissions to add a new product");
  }

  try {
    let prod = new ProdModel(req.body);
    // מגיע מהמידל וואר של בדיקת הטוקן
    prod.user_id = req.userToken._id;

    // יחזיר מספר בן 6 ספרות
    prod.prodNumber = await generateProdNumber(ProdModel);

    prod.prodImage = prod.prodImage;

    let prodData = await prod.save();
    res.status(201).json(prodData);
  } catch (err) {
    // 14:54
    console.log(err);
    res.status(400).json(err);
  }
});

router.put("/:id", authToken, async (req, res) => {
  let { error } = validateProd(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    let userData = await ProdModel.findOne({ _id: req.params.id });
    let prod = await ProdModel.findOneAndUpdate(
      { _id: req.params.id, user_id: userData.user_id },
      req.body
    );
    if (!prod)
      return res.status(404).send("The prod with the given ID was not found.");

    prod = await ProdModel.findOne({
      _id: req.params.id,
      user_id: userData.user_id,
    });
    res.send(prod);
  } catch (err) {
    console.log("catch error affter update try" + err);
  }
});

router.delete("/:id", authToken, async (req, res) => {
  let prod = await ProdModel.findOneAndDelete({
    _id: req.params.id,
    user_id: req.userToken._id,
  });
  if (!prod) {
    return res.status(400).json({ msg: "prod not found and cant be delted" });
  }
  // 204 -> סטטוס שהתבצע מחיקה
  res.json(prod);
});

module.exports = router;
