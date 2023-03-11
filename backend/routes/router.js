const express = require("express");
const register = require("../controller/user/register");
const Login = require("../controller/user/login");

const app = express.Router();

app.get("/", (req, res) => {
    return res.send("Hello");
});

app.post("/register", register);

app.post("/login", Login);

module.exports = app;
