import { User } from "../models/user.models.js";
import { Apierror } from "../utlis/ApiError.js";
import { ApiResponse } from "../utlis/ApiResponse.js";
import { asyncHandler } from "../utlis/asynchandler.js";
import { uploadOnCloudinary } from "../utlis/cloudinary.js";
import jwt from "jsonwebtoken"


const genrateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.genrateAccessToken()
        const refreshToken = await user.genrateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        console.log("/n", accessToken, "/n", refreshToken)
        return { accessToken, refreshToken }
    } catch (error) {
        throw new Apierror(500, "Something went wrong while generating referesh and access token")
    }
}





const registerUser = asyncHandler(async (req, res) => {
    // get the user details from the frontend
    // validate the request suggested to use the zod library
    // then check if the user is already exist or not
    // check for images and also check for avtars and upload it on the cloudinary
    // crete the user object
    // remove the pass and refresh token field
    // return the response
    const { fullName, email, username, password } = req.body


    if (!username || !email) {
        throw new Apierror(400, "username or email is required")
    }
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new Apierror(400, "All fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new Apierror(409, "User with email or username already exists")
    }
    console.log(req.files.avatar[0].path)
    // check for the File 
    const avatarLocalPath = req.files?.avatar[0]?.path;
    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if (!avatarLocalPath) {
        throw new Apierror(400, "Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    console.log(avatar, "/n", coverImage)

    if (!avatar) {
        throw new Apierror(400, "Avatar file is required")
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new Apierror(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie


    const { username, email, password } = req.body
    console.log(username, password)
    if (!username && !email) {
        throw new Apierror(400, "username or email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new Apierror(400, "user Does not exist")
    }

    const isPasswordVaild = await user.isCorrect(password)
    if (!isPasswordVaild) {
        throw new Apierror(401, "Invalid credentiasl")
    }
    const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, option).cookie("refreshToken", refreshToken, option).json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "userLogged in Successfully"))
})


const logoutUser = asyncHandler(async (req, res) => {
    User.findByIdAndUpdate(req.userId, {
        $set: {
            refreshToken: undefined
        }
    },
        {
            new: true
        })
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incommingRefreshToken) {
        throw new Apierror(401, "unauthorised")
    }
    try {
        const decodeToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodeToken._id);
        if (!user) {
            throw new Apierror(401, "invalid token")
        }

        if (incommingRefreshToken != user?.refreshToken) {
            throw new Apierror(401, "Refresh token is expired or used")
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, newRefreshToken } = await genrateAccessAndRefreshToken(user._id)
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed"
                )
            )


    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const user = await User.findById(req.user?._id)

    const isPAsswordCorrect = user.isCorrect(oldPassword)
    if (!isPAsswordCorrect) {
        throw new Apierror(400, "invalid old password")
    }
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})


const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
        throw new Apierror(400, "All fields are requied")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details updated successfully"))
})


const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req?.file?.path
    if (!avatarLocalPath) {
        throw new Apierror(400, "Avatar file is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const user = await User.findOneAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true }).select("-password")

    return res.status(201).json(ApiResponse(200, user, "Avatar image updated successfully"))
})
const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverLocalPath = req?.file?.path
    if (!coverLocalPath) {
        throw new Apierror(400, "Avatar file is missing")
    }
    const cover = await uploadOnCloudinary(coverLocalPath)
    const user = await User.findOneAndUpdate(req.user?._id, {
        $set: {
            coverImage: cover.url
        }
    }, { new: true }).select("-password")

    return res.status(201).json(ApiResponse(200, user, "Cover image updated successfully"))
})





export { registerUser, loginUser, logoutUser, refreshAccessToken, updateAccountDetails, updateUserAvatar, updateUserCoverImage }