const likes = require("../../model/likes");
const User = require("../../model/user");
const Video = require("../../model/video");

const likeVideo = (req, res) => {

    const videoId = req.params.id;

    if (!videoId) {
        return res.status(400).json({ "message": "invalid video id" });
    }


    if (req.user) {

        const userID = req.user;


        Video.findOne({ _id: videoId }).then(data => {

            if (!data) {
                return res.status(400).json({ "message": "video not found" });
            }

            // likes update
            // condition to check check current user is already liked or not
            const updateCondition = {
                _id: videoId,
                "users._id": { $ne: userID }
            }

            // update user when he likes
            const updateLikes = {
                $addToSet: {
                    users: {
                        _id: userID
                    }
                },
                $inc: {
                    likes: 1
                }
            }

            likes.findOneAndUpdate(updateCondition, updateLikes).then(like => {

                // like the video
                if (like) {

                    // add liked video in user likedVideos
                    const updateUserLikes = {
                        $addToSet: {
                            likedVideos: {
                                _id: videoId
                            }
                        }
                    }


                    User.findByIdAndUpdate({ _id: userID }, updateUserLikes)
                        .then(user => {
                            return res.status(200).send({ "message": "video liked", "status": 200 });
                        })
                        .catch(err => {
                            return res.status(400).json({ "message": "something went wrong during liking video" });

                        });
                }

                // dislike video

                if (!like) {
                    const dislikeCondition = {
                        _id: videoId,
                        "users._id": userID
                    }

                    // dislike update
                    const updateLikes = {
                        $pull: {
                            users: {
                                _id: userID
                            }
                        },
                        $inc: {
                            likes: -1
                        }
                    }

                    likes.findOneAndUpdate(dislikeCondition, updateLikes).then(dislike => {

                        if (dislike) {

                            // update from user favorite videos
                            const updateUserLikes = {
                                $pull: {
                                    likedVideos: {
                                        _id: videoId
                                    }
                                }

                            }
                            User.findByIdAndUpdate({ _id: userID }, updateUserLikes)
                                .then(user => {
                                    if (!user) {
                                        return res.status(400).json({ "message": "something went wrong" });

                                    }
                                    return res.status(200).send({ "message": "video disliked", "status": 200 });
                                })
                                .catch(err => {
                                    return res.status(400).json({ "message": "something went wrong during disliking video" });

                                })
                        }

                    })
                }


            }).catch(err => {

                return res.status(400).json({ "message": "something went wrong during liking video" });

            })

        }).catch(err => {
            console.log(err);

            return res.status(400).json({ "message": "something went wrong during video fetching" });

        })
    } else {
        return res.status(400).json({ "message": "login to like the video" });

    }



}

module.exports = likeVideo;
