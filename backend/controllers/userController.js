import userModel from '../models/userModel.js'

export const getUserData = async (req, res) => {
    try {

        const userId = req.userId;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User Not Found.." })
        }
        
        res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
        });


    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }

}