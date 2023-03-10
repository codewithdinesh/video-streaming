const express = require("express");
const register = require("../controller/user/register");
const Login = require("../controller/user/login");
const verifyToken = require("../middleware/auth");
const uploadVideo = require("../controller/video/uploadVideo");
const multer = require("multer");
const getVideos = require("../controller/video/getVideos");
const getVideo = require("../controller/video/getVideo");
const likeVideo = require("../controller/video/likeVideo");

const app = express.Router();

app.get("/secret", verifyToken, (req, res) => {
    return res.send("Hello");
});

app.post("/register", register);

app.post("/login", Login);


app.post("/upload", verifyToken, multer({ dest: 'temp/' }).fields([{ name: "videoSource", maxCount: 1 }, { name: "videoThumbnail", maxCount: 1 }]), uploadVideo);

app.get("/videos", getVideos);

app.get("/video/:id", getVideo);

app.post("/video/like/:id", verifyToken, likeVideo);


module.exports = app;
