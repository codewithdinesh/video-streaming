require("dotenv").config()
const express = require("express");
const app = express();
const router = require("./routes/router")
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(cookieParser())

app.use("/", router);

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log("Server started at : " + port);
})