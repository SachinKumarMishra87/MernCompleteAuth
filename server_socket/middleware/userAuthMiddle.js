import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized. Login Again token nhi milaa",
            error: true
        })
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decode);

        if (decode._id) {
            req.userId = decode._id;
        } else {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again kuch or dikkat",
                error: true
            })
        }

        next();

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
            error: true
        })
    }
}