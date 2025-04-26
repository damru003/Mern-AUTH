import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import transporter from './nodeMailer.js';


export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User Already exists.." });
        };
        const hashPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to MERN Auth',
            text: `Welcome to MERN Auth. Your account has been succesfully created with this ${email} email Id...`
        }

        await transporter.sendMail(mailOptions);

        console.log("Sending email to:", email);


        return res.json({ success: true, message: "User Registration Successfull.." })
    }
    catch (error) {
        res.json({ success: false, message: error.message });
    };
};

export const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email and password is required.." })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid Email.." })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: "User Login Successfully" })

    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict'
        })
        return res.json({ success: true, message: "User Logout.." })
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const sendVerifyOtp = async (req, res) => {

    try {
        const userId = req.userId;

        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account Already Verified..s" })
        }

        const OTP = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = OTP;

        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your Six Digit OTP is ${OTP}. Please Verify your account using this OTP...`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Verification OTP Send to user email" })
    }
    catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {

    const { OTP } = req.body;
    const { userId } = req;

    if (!userId || !OTP) {
        return res.json({ success: false, message: "Something is Missing..." });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not Found..." })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== OTP) {
            return res.json({ success: false, message: "Invalid OTP..." });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired..." })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Email Verifieds Successfully..." })
    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const sendResetOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({success:false, message:"Email is required..."})
    }

    try{
        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success:false, message:"User not Found"});
        }

        const OTP = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = OTP;

        user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `OTP for resetting your password is ${OTP}. Please update your new password using this OTP...`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Password Reset OTP Send to user email" })  
    }
    catch (error) {
        return res.json({success:false, message:error.message});
    }
}

export const resetPassword = async (req, res) => {

    const { email, OTP, newPassword } = req.body;

    if(!email || !OTP || !newPassword) {
        return res.json({success:false, message:"Email, OTP and New Password is required.."})
    }

    try {

        const user = await userModel.findOne({email});

        if (!user) {
            return res.json({success:false, message:"User is not Found.."})
        }

        if (user.resetOtp === '' || user.resetOtp !== OTP ) {
            return res.json({success:false, message:"Invalid OTP.."})
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({success:false, message:"OTP Expired.."})
        }

        const hassPassword = await bcrypt.hash(newPassword, 10);

        user.password = hassPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({success:true, message:"Password has been Changed Successfully..."});

    }
    catch (error) {
        return res.json({success:false, message:error.message});
    }
}