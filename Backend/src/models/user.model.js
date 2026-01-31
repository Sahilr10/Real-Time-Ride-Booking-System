import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schems({
    fullname: {
        type: String,
        required: true,
        trim: true,
        minLength: [3, "Full name must be at least 3 characters long"]
    },
    username:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        minLength: [3, "Username must be at least 3 characters long"]
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minLength: [5, "Email must ne at least 3 characters"]
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String
    },
    socketId: {
        type: String
    }
},
{ timestamps: true } 
);

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User = mongoose.model("User", userSchema);