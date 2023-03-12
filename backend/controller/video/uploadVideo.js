const videoSchema = require("../../model/video");
const userSchema = require("../../model/user");
const crypto = require("crypto");
const TimeStamp = require("../../utility/TimeStamp")

// ffmpeg for video conversion
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const ffmpeg_static = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegPath);

const path = require('path');
const fs = require('fs');
const aws = require('aws-sdk');


const viewsSchema = require("../../model/views");
const likesSchema = require("../../model/likes");
const Views = require("../../model/views");
const likes = require("../../model/likes");


// aws setup
aws.config.setPromisesDependency();
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION
});

s3 = new aws.S3();


const uploadVideo = async (req, res) => {

    // if user is logged then and only upload the video
    if (req.user) {


        const videoTitle = req.body.videoTitle;

        const videoDescription = req.body.videoDescription;

        const creatorID = req.user;


        if (!videoTitle) {
            return res.status(404).send({ "message": "Video Title is Required" });
        }

        if (!videoDescription) {
            return res.status(404).send({ "message": "Video Description is Required" });
        }

        if (!req.files.videoSource) {
            return res.status(404).send({ message: "Video File Not Selected" });
        }

        const video = req.files.videoSource[0];

        console.log(video)

        if (!video) {
            return res.status(404).send({ "message": "Video File is Required" });
        }

        let videofilename, videoThumbnail, videoThumbnailParam, videoThumbnailFileName, videoThumbnailKey, thumbainMimetype;

        const videoMimetype = video.mimetype;

        const videoKey = crypto.randomUUID();

        // video thumbnail
        if (req.files.videoThumbnail) {

            videoThumbnail = req.files.videoThumbnail[0];
            videoThumbnailFileName = videoThumbnail.path;

            console.log(videoThumbnailFileName);

            thumbainMimetype = videoThumbnail.mimetype;

            if (thumbainMimetype.startsWith("image")) {

                videoThumbnailKey = "videoThumbnails/" + videoKey + path.extname(videoThumbnail.originalname);

                videoThumbnailParam = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Body: fs.createReadStream(videoThumbnail.path),
                    Key: videoThumbnailKey,
                    ACL: 'public-read',
                    ContentType: "image/png"
                }

            } else {
                return res.status(415).send({ "message": "Please Select Image File for VideoCover" });
            }
        }



        if (videoMimetype.startsWith("video")) {

            // compress video or change video format of video to .mp4 before uploding using ffmgpe

            videofilename = "temp/videos/" + videoKey + ".mp4";

            await new Promise((resolve, reject) => {

                ffmpeg(video.path).videoCodec("libx264").size('720x?').withAspect('16:9').saveToFile(videofilename)
                    .on("start", () => {
                        console.log("video coversion started");
                    })
                    .on("error", (err) => {
                        console.log(err);
                        res.status(401).send({
                            "message": "Error accure durinig video convert", err: err
                        })
                        reject();
                    })
                    .on("end", (data) => {
                        console.log("video converted");
                        resolve();
                    });
                return;
            }).catch(err => {
                console.log("Error:" + err)
            })

            // detele temp video file
            fs.unlink(video.path, function (err, result) {
                if (err) {
                    console.error(err);
                }

            });

            // videoKey
            const videofileKey = "videos/" + videoKey + ".mp4";

            var videoparams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: fs.createReadStream(videofilename),
                Key: videofileKey,
                ACL: 'public-read',
                ContentType: "video/mp4"
            };



            // generate thumbanil from video

            if (!req.files.videoThumbnail) {

                const videoThumbnailFileNameTemp = videoKey + ".png";

                videoThumbnailKey = "videoThumbnails/" + videoKey + ".png";

                videoThumbnailFileName = "temp/" + videoKey + ".png";

                await new Promise((resolve, reject) => {

                    ffmpeg(videofilename)
                        .setFfmpegPath(ffmpeg_static)
                        .screenshots(
                            {
                                timestamps: [1],
                                count: 1,
                                folder: "temp/",
                                filename: videoThumbnailFileNameTemp,
                                size: "1280x720"
                            }
                        ).on("start", err => {
                            console.log("Thumbnail Generation started..")
                        })
                        .on("error", err => {
                            res.status(401).send({ "message": "error while Generating video Thumbnail" })
                            reject();
                        })
                        .on("end", (data) => {
                            console.log("Thumbnail Generated");
                            resolve();
                        });
                });


                videoThumbnailParam = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Body: fs.createReadStream(videoThumbnailFileName),
                    Key: videoThumbnailKey,
                    ACL: 'public-read',
                    ContentType: "image/png"
                }
            }

            // upload
            await s3.upload(videoparams, async (err, data) => {
                if (err) {
                    return res.staus(401).send({ "message": "Error While Uploading Video" })
                }
                if (data) {
                    let videoUploadedOn = new Date().toLocaleString();

                    const newVideo = new videoSchema({
                        videoid: videofileKey,
                        title: videoTitle,
                        description: videoDescription,
                        creator: creatorID,
                        videoCover: videoThumbnailKey,
                        uploadOn: videoUploadedOn
                    });


                    s3.upload(videoThumbnailParam, async (thumbnail_err, thumbnail_res) => {

                        if (thumbnail_err) {
                            return res.status(400).send({ "message": "error while uploading video thumbnail, please try again" })
                        }
                        console.log("Thumbnail Uploaded");

                    })

                    // deteting converted video file
                    fs.unlink(videofilename, (err) => {
                        if (err) {
                            console.log("Error while deleting Temp file")
                        }

                    });

                    // deleting video thumbnail file
                    fs.unlink(videoThumbnailFileName, (err) => {
                        if (err) {
                            console.log("Error while deleting thumbnail Temp file")
                        }
                    })


                    newVideo.save();

                    // updating creator videos list
                    userSchema.findOneAndUpdate({ _id: creatorID }, {
                        $push: {
                            videos: newVideo._id,
                        }
                    }, {
                        new: true

                    }).exec();

                    // views
                    const newViews = new Views({
                        _id: newVideo._id,
                        Views: 0
                    });

                    // likes
                    const newLikes = new likes({
                        _id: newVideo._id,
                        likes: 0
                    });

                    newLikes.save();
                    newViews.save();

                    return res
                        .status(200)
                        .send({
                            status: "Video Uploaded Successfully",
                            ResponseCreated: TimeStamp(),
                            videoID: newVideo._id,
                            creatorID: creatorID,
                        });
                }
            })
        } else {
            return res
                .status(408).send({
                    "message": "Select proper Video Type: mp4, avi, ogg, webm, wvm, m3u8, mov", ResponseCreated: TimeStamp(),
                });

        }
    } else {
        return res.status(404).send({ "message": "login to upload video" });
    }

}

module.exports = uploadVideo;


