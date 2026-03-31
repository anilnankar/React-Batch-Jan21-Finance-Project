const express = require("express");

const validate = require("../../middlewares/validate.middleware");
const { loginSchema } = require("./auth.validation");
const { loginHandler } = require("./auth.controller");

const router = express.Router();

router.post("/login", validate(loginSchema), loginHandler);

module.exports = router;
