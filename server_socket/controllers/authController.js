
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../model/userMOdel.js";
import transport from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.json({
                success: false,
                message: "Missing Details",
                error: true
            });
        }

        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            return res.json({
                success: false,
                message: "User already exists",
                error: true
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const user = new UserModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // sending welcome email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to CSN",
            text: `Welcome to CSN website. Your accound has 
            been created with email id: ${email}`
        }

        await transport.sendMail(mailOption);

        return res.json({
            success: true,
            message: "User registered successfully",
            error: false,
            data: user
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
            error: true
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.json({
                success: false,
                message: "Missing Details",
                error: true
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
                error: true
            })
        }

        const comparePassword = await bcryptjs.compare(password, user.password);
        if (!comparePassword) {
            return res.json({
                success: false,
                message: "Incorrect password",
                error: true,
            });
        }

        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }).json({
            success: true,
            message: "User Login successfully",
            error: false,
            data: user
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
            error: true
        });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            samesite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })

        return res.json({
            success: true,
            message: "User Logout successfully",
            error: false
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
            error: true
        });
    }

}

// send otp to user email
export const sendOtpOnEmail = async (req, res) => {
    try {
        const userId = req.userId
        const user = await UserModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account already verified",
                error: true
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification Otp",
            // text: `Your OTP is <h4>${otp}</h4>. Verify your account using this
            // OTP. This is valid only 1 days`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transport.sendMail(mailOption);

        return res.json({
            success: true,
            message: "Verification OTP Sent on Email",
            error: false
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
            error: true
        });
    }

}

export const verifyEmailOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const { otp } = req.body;

        if (!userId || !otp) {
            return res.json({
                success: false,
                message: "Missing Details",
                error: true
            })
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
                error: true
            })
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.json({
                success: false,
                message: "Invalid Otp",
                error: true
            })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "Otp Expired",
                error: true
            })
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({
            success: true,
            message: "Email verified successFully",
            error: false
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
            error: true
        })
    }

}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({
            success: true,
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

export const sendPasswordResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({
            success: false,
            message: "Please fill email",
            error: true
        })
    }

    try {
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
                error: true
            })
        }

        // generate Otp
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save()

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset Otp",
            text: `Your OTP is for reseting your password <h4>${otp}</h4>. 
            Use this OTP to proceed with reseting your password.
            This OTP is valid only for 15 Minutes`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transport.sendMail(mailOption);

        return res.json({
            success: true,
            message: `OTP sent to your Email`,
            error: false
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
            error: true
        })
    }
}

export const verifyOtpResetPassword = async (req, res) => {
    const { otp, email, newPassword } = req.body

    if (!otp || !email || !newPassword) {
        return res.json({
            success: false,
            message: "Missing Details",
            error: true
        })
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
                error: true
            })
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({
                success: false,
                message: "Invalid Otp",
                error: true
            })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "Otp Expired",
                error: true
            })
        }

        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpExpireAt = 0;

        await user.save()

        return res.json({
            success: true,
            message: "Password has been reset successfully",
            error: false
        })

    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
            error: true
        })
    }

}