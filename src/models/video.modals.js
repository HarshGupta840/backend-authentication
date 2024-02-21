import mongoose, { Aggregate } from "mongoose"
import mongooseAggregratePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema = new mongoose.Schema({
    VideoFile: {
        type: String,   //cloudinary image
        required: true,
    },
    thumbnail: {
        type: String,   //cloudinary image
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,  //cloudinary url
        required: true
    },
    views: {
        type: Number,  //cloudinary url
        default: true
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })


videoSchema.plugin(mongooseAggregratePaginate)
export const Video = mongoose.model("Video", videoSchema)