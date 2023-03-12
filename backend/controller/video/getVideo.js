const likes = require("../../model/likes");
const Video = require("../../model/video");
const User = require("../../model/user");

const getVideo = (req, res) => {

    const videoId = req.params.id;
    let like_count;


    Video.findOne({ _id: videoId }).then(data => {

        if (!data) {
            return res.status(400).send({ "message": "video not found" });

        }

        // find likes
        likes.findOne({ _id: videoId }).then(like => {

            if (!like) {
                return res.status(400).json({ "message": "likes not found" });
            }

            like_count = like.likes;

            const videoSource = process.env.AWS_URL + data.videoid;
            const videoTitle = data.title;
            const videoDescription = data.description;
            const videoCreator = data.creator;
            const videoUploadedOn = data.uploadOn;
            const videoThumbnail = process.env.AWS_URL + data.videoCover;


            // fetch creator details

            User.findOne({ _id: videoCreator }).then(user => {

                const creatorName = user.name;
                const creatorUserName = user.username;


                return res.status(200).json({
                    videoId: data.id,
                    videoSource,
                    videoTitle,
                    videoDescription,
                    videoThumbnail,
                    videoCreator: {
                        videoCreator,
                        creatorName,
                        creatorUserName
                    },
                    videoUploadedOn,
                    likes: like_count

                });


            }).catch(err => {
                return res.status(400).json({ "message": "creator not found" })
            })




        }).catch(err => {
            return res.status(400).json({ "message": "something went wrong during fetching likes" });
        })



    }).catch(err => {
        console.log(err);
        return res.status(400).send({ "message": "something went wrong during fetching video" })
    })


}

module.exports = getVideo;