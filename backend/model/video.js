const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({

    videoid: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: [true, "video Title required"]
    },

    description: {
        type: String,
        required: [true, "description required"]
    },

    videoCover: {
        type: String
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "creator Id required"]
    },
    uploadOn: {
        type: String,
        default: new Date().toLocaleString()
    }
});

VideoSchema.index({ title: 'text', description: 'text', });

const Video = mongoose.model('video', VideoSchema);
Video.createIndexes();
module.exports = Video;