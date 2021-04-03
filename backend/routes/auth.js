// קובץ שמתעסק עם הלוג אין בלבד ומחזיר טוקן בסופו של דבר

const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secret } = require("../config/secret");
const { UserModel } = require("../models/userModel");
const router = express.Router();

// login
router.post("/", async (req, res) => {
  let { error } = validLoginUser(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  let user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  let validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({
    token: generateToken(user._id, user.admin),
    refreshToken: generateRefreshToken(user._id, user.admin),
  });
});

//// generate Token
const generateToken = (_id, _admin) => {
  let token = jwt.sign({ _id: _id, admin: _admin }, secret.JWTSecretKey, {
    expiresIn: "2h",
  });
  return token;
};

///// here you need to make a new key for  in you secret file!!
//// generate Refresh  Token REFRESH_TOKEN
const generateRefreshToken = (_id, _admin) => {
  let token = jwt.sign({ _id: _id, admin: _admin }, secret.REFRESH_TOKEN, {
    expiresIn: "1d",
  });
  return token;
};

//// verify refresh-token
const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, secret.REFRESH_TOKEN, (err, payload) => {
      if (err) {
        return reject("invalid refreshToken or expired refreshToken");
      }
      const _id = payload._id;
      const _admin = payload.admin;
      resolve({ _id, _admin });
    });
  });
};

/// refresh token
router.post("/refreshToken", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send("badRequest");
    }
    const { _id, _admin } = await verifyRefreshToken(refreshToken);

    const token = await generateToken(_id, _admin);
    const refToken = await generateRefreshToken(_id, _admin);
    res.json({
      token: token,
      refreshToken: refToken,
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

const validLoginUser = (_userBody) => {
  let schema = Joi.object({
    email: Joi.string().min(2).max(100).email().required(),
    password: Joi.string().min(2).max(100).required(),
  });
  return schema.validate(_userBody);
};

module.exports = router;
