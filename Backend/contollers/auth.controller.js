
// import User from '../models/user.model.js';

// export const registerUser = async (req, res) => {
//     const { name, email, password, conformPassword, role } = req.body;
//     if(!name || !email || !password || !conformPassword || !role) {
//         return res.status(400).json({ success: false, message: "All fields are required" });
//     }
//     if(password !== conformPassword) {
//         return res.status(400).json({ success: false, message: "Passwords do not match" });
//     }
//     let user = await User.findOne({ email });
//     if(user) {
//         return res.status(400).json({ success: false, message: "User already exists" });
//     }
//     user = await User.create({ name, email, Password: password, conformPassword, role });
//     const token = user.getJWTToken();
//     res.status(201).cookie("token", token, {
//         expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict"
//     }).json({
//         success: true,
//         message: "User registered successfully", 
//         user: {
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role
//         }
//     });
// }

// export const loginUser = async (req, res) => {
//     // TODO: Implement login logic
//     res.json({ message: "Login endpoint" });
// }

// export const getUser = async (req, res) => {
//     // TODO: Implement get user logic
//     res.json({ message: "Get user endpoint" });
// }

// export const logoutUser = async (req, res) => {
//     // TODO: Implement logout logic
//     res.json({ message: "Logout endpoint" });
// }

// export const forgetPassword = async (req, res) => {
//     // TODO: Implement forget password logic
//     res.json({ message: "Forget password endpoint" });
// }

// export const resetPassword = async (req, res) => {
//     // TODO: Implement reset password logic
//     res.json({ message: "Reset password endpoint" });
// }