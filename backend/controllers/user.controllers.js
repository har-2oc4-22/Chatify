import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"

/**
 * Get current logged in user
 * @route GET /api/user/current
 * @access Private
 */
export const getCurrentUser = async (req, res, next) => {
    try {
        let user = await User.findById(req.userId).select("-password")
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        return res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

/**
 * Edit user profile
 * @route PUT /api/user/profile
 * @access Private
 */
export const editProfile = async (req, res, next) => {
    try {
        let { name } = req.body
        let image;
        
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        // Build update object dynamically to only update provided fields
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (image) updateData.image = image;

        let user = await User.findByIdAndUpdate(req.userId, updateData, { 
            new: true,
            runValidators: true // Ensure model validators run on update
        }).select("-password");

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }

        return res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

/**
 * Get all users except current user
 * @route GET /api/user/other-users
 * @access Private
 */
export const getOtherUsers = async (req, res, next) => {
    try {
        let users = await User.find({
            _id: { $ne: req.userId }
        }).select("-password")
        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

/**
 * Search users by name or userName
 * @route GET /api/user/search
 * @access Private
 */
export const search = async (req, res, next) => {
    try {
        let { query } = req.query
        if (!query || query.trim().length === 0) {
            const error = new Error("Search query is required");
            error.statusCode = 400;
            return next(error);
        }

        query = query.trim();

        let users = await User.find({
            $and: [
                { _id: { $ne: req.userId } }, // Don't return current user in search
                {
                    $or: [
                        { name: { $regex: query, $options: "i" } },
                        { userName: { $regex: query, $options: "i" } },
                    ]
                }
            ]
        }).select("-password")
        
        return res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}