const express = require("express");

const { getSystemHealth } = require("./health.controller");

const router = express.Router();

router.get("/", getSystemHealth);

module.exports = router;
