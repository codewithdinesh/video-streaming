
const jwt = require("jsonwebtoken");
const userSchema = require("../model/user");
const TimeStamp = require("../utility/TimeStamp");

const verifyToken = (req, res, next) => {
    const token = req.headers.token || req.cookies.token_id;
    if (!token) {
        return res.status(401).send({
            message: "Authentication is required",
            code: "401",
            ResponseCreated: TimeStamp(),
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (decoded.user_id) {

            //req.user = decoded
            userSchema.findOne({ token: token }).then(result => {

                if (!result) {
                    return res.status(400).send({
                        message: "Invalid Authentication",
                        code: "400",
                        ResponseCreated: TimeStamp(),
                    });

                }
                else {

                    // save user data 
                    req.user = decoded.user_id;
                    req.user_email = result.email;

                    return next();
                }
            }).catch((err) => {

                if (err)
                    return res.status(400).send({
                        message: "Authentication Error",
                        code: "400",
                        ResponseCreated: TimeStamp(),
                    });
            });

        }

    } catch (err) {
        return res.status(400).send({ message: "Invalid Token" });
    }

}

module.exports = verifyToken;
