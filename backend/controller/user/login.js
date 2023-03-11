const validateEmail = require("../../utility/validateEmail");
const userModel = require("../../model/user");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const TimeStamp = require("../../utility/TimeStamp");

const Login = (req, res) => {


    var email = req.body.email;
    var pass = req.body.pass;

    const currentDate = new Date().getTime();
    const timestamp = new Date(currentDate);

    /* Check email enterred or not */
    if (!email) {
        return res.status(400).send(JSON.stringify({ "message": "Email is Required", "status": 400, "ResponseCreated": timestamp }));

    }

    /* Check password is enterred or not */
    if (!pass) {
        return res.status(400).send(JSON.stringify({ "message": "Password is Required", "status": 400, "ResponseCreated": timestamp }));

    }

    if (validateEmail(email)) {

        userModel.findOne({ email: email }).then((user) => {

            if (!user) return res.status(401).send({ "status": "user not found", "email": email, "ResponseCreated": TimeStamp() });

            bcrypt.compare(pass, user.password, function (err, result) {

                if (err) return res.status(400).send(err);

                if (result === false) {
                    return res.status(401).send({ "status": "password not match", "email": email, "ResponseCreated": TimeStamp() })
                }

                // store cookie
                // Create token
                const token = jwt.sign(

                    {
                        user_id: user._id
                    },
                    process.env.SECRET_KEY || "SECRET_KEY_Ystream",
                    {
                        expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
                    }
                );

                userModel.findByIdAndUpdate({ _id: user._id }, {
                    token: token
                }, { new: true }).exec();

                let options = {
                    path: "/",
                    sameSite: true,
                    maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                    httpOnly: true,
                }

                res.cookie('token_id', token, options);
                res.status(200).send({ "status": "login success", "login_token": token, "email": email, "userId": user._id, "ResponseCreated": TimeStamp() });

            })

        }).catch(err => {

            if (err) return res.status(400).send(err);
        });
    }
}

module.exports = Login;
