require("dotenv")

module.exports = {
    url: process.env.DB_URL_LOCAL || "mongodb://localhost:27017/ystream",
    model: "video"
};