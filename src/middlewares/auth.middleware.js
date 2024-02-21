import { User } from "../models/user.models.js";
import { Apierror } from "../utlis/ApiError.js";
import jwt from "jsonwebtoken"


export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
        if (!token) {
            throw new Apierror(401, "unauthorized request");
        }

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")

        if (!user) {

            throw new Apierror(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new Apierror(401, error?.message || "Invalid access token")
    }
}