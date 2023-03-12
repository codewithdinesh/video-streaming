const Video = require("../../model/video");

const getVideos = (req, res) => {

    Video.find({}).then(data => {

        if (!data) {
            return res.status(400).send({ "message": "videos not found" });
        }

        return res.status(200).json(data);
    }).catch(err => {
        return res.status(400).send({ "message": "error during fetching videos " });

    })
}

module.exports = getVideos;

