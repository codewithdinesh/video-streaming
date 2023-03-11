const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: [true, "user name required"],
        index: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password required"],
    },
    email: {
        type: String,
        unique: true,
        index: true,
        required: [true, "Email required"],
    },
    name: {
        type: String,
        required: [true, "name required"],
    },
    token: {
        type: String,
    },
    likedVideos: [{

        /* list of favorite videos */
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "video"
        }
    }
    ],
    videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "video",
        },
    ],
});

const User = mongoose.model("user", UserSchema);
module.exports = User;