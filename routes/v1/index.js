const router = require("express").Router();
const swaggerUI = require("swagger-ui-express");
const YAML = require("yaml");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = process.env;
const { image } = require("../../libs/multer.js");
const { imageKitUpload } = require("../../controller/v1/media.controllers.js");

// Restrict for Authenticate
let restrict = (req, res, next) => {
  let { authorization } = req.headers;
  if (!authorization || !authorization.split(" ")[1]) {
    res.status(400).json({
      status: false,
      message: "Token not provided",
      data: null,
    });
  }

  let token = authorization.split(" ")[1];
  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      res.status(401).json({
        status: false,
        message: err.message,
        data: null,
      });
    }
    delete user.iat;
    req.user = user;
  });
  next();
};

// Required Controller
const userController = require("../../controller/v1/userController.js");
const authController = require("../../controller/v1/authController.js");


// API Users + Profile //
router.post("/api/v1/users", userController.store);
router.get("/api/v1/users", userController.index);
router.put("/api/v1/users/:id/users", restrict, userController.update);
router.post("/api/v1/users/upload", restrict, image.single("file"),imageKitUpload);
router.put("/api/v1/users/:id/avatar", restrict, userController.avatar);

// API Auth //
router.post("/api/v1/auth/login", authController.login);
router.get("/api/v1/auth/authenticate", restrict, authController.auth);

module.exports = router;