const bcrypt = require("bcrypt");
const validateEmail = require("../../utility/validateEmail");
const validateUserName = require("../../utility/validateUsername");
const userModel = require("../../model/user");
const jwt = require("jsonwebtoken")
const connConnect = require("../../config/db").conConnect;



const register = async (req, res) => {

    // console.log(req.body);

    var email = req.body.email;
    var pass = req.body.pass;
    var retype_pass = req.body.retype_pass;
    var username = req.body.username;
    var name = req.body.name;


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

    /* Check retype_pass */
    if (!retype_pass) {
        return res.status(400).send(JSON.stringify({ "message": "Retype Password  Required", "status": 400, "ResponseCreated": timestamp }));

    }

    /* Check username is enterred or not */
    if (!username) {
        return res.status(400).send(JSON.stringify({ "message": "username is Required", "status": 400, "ResponseCreated": timestamp }));

    }

    /* check name */
    if (!name) {
        return res.status(400).send(JSON.stringify({ "message": "Name is Required", "status": 400, "ResponseCreated": timestamp }));
    }

    if (validateEmail(email) == true) {

        if (pass != retype_pass) {

            return res.status(401).send({ "message": "password does not match", "status": 401, "email": email, "ResponseCreated": timestamp })
        }


        const exists = await userModel.exists({ email: email });
        // console.log(exists)



        /*   check username format */

        if (validateUserName(username) == true) {


            const userNameExists = await userModel.exists({ username: username });

            if (exists) {

                return res.status(404).send({ "email": email, "status": 409, "message": "already having account", "ResponseCreated": timestamp });
                // res.redirect('/login');


            } else {

                if (!userNameExists) {

                    /* Encrypting password and storing user data to database*/

                    bcrypt.genSalt(10, function (err, salt) {

                        if (err) return next(err);
                        bcrypt.hash(pass, salt, function (err, hash) {

                            if (err) return next(err);

                            const newUser = new userModel({
                                email: email,
                                password: hash,
                                username: username,
                                name: name,

                            });

                            /* Create token */
                            const token = jwt.sign(
                                {
                                    user_id: newUser._id
                                },
                                process.env.SECRET_KEY || "SECRET_KE",
                                {
                                    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)

                                }
                            );

                            /* save user token */
                            newUser.token = token;
                            newUser.save();

                            let options = {
                                path: "/",
                                sameSite: true,
                                maxAge: 1000 * 60 * 60 * 24, // would expire after 24 hours
                                httpOnly: true,
                            }

                            res.cookie('token_id', token, options);
                            return res.status(200).send({ "message": "account created successfully", "status": 200, "login_token": token, "email": email, "ResponseCreated": timestamp });
                        });
                    });
                }

                else {

                    return res.status(400).send(JSON.stringify({ "message": "username not available", "status": 400, "ResponseCreated": timestamp }));

                }
            }
        }
        else {
            return res.status(400).send(JSON.stringify({ "message": "username is invalid", "status": 400, "ResponseCreated": timestamp }));
        }

    }

    else {

        return res.status(400).send(JSON.stringify({ "message": "invalid Email", "status": 400, "email": email, "ResponseCreated": timestamp }));

    }


}

module.exports = register;