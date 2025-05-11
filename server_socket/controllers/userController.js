import UserModel from "../model/userMOdel.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.json({
                message: "Misssing details",
                success: false,
                error: true
            })
        }

        const user = await UserModel.findById(userId)
        if (!user) {
            return res.json({
                message: "User not found",
                success: false,
                error: true
            })
        }

        return res.json({
            success: true,
            error: false,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        })

    } catch (error) {
        return res.json({
            message: error.message,
            success: false,
            error: true
        })
    }
}