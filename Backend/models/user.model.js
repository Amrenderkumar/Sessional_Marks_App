import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxLength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        maxLength: [100, "Email cannot exceed 100 characters"],
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    Password: {
        type: String,
        required: [true, "Password is required"],
        select: false,
        minLength: [8, "Password must be at least 8 characters long"]
    },
    conformPassword: {
        type: String,
        required: [true, "Conform Password is required"]
    },
    role: {
        type: String,
        enum: ["Student", "Admin", "Teacher"],
        default: "Student"
    },
    department:{
        type: String,
        trim: true,
        default: null 
    },
    experties: {
        type: String,
        default: null
    },
    maxStudent: {
        type: Number,
        default: 10,
        min: [1, "Max student must be at least 1"],
    },
    assignedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    superviser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null
    }
}, { timestamps: true });

// JWT Token method
userSchema.methods.getJWTToken = function() {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || "7d"
    });
};

const User = mongoose.model("User", userSchema);

export default User;