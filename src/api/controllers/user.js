const { User } = require("../../database/models"); // Ensure correct import if using Sequelize index.js exports
const { Todo } = require("../../database/models"); // Ensure correct import if using Sequelize index.js exports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require('fs');
const path = require('path');


const signup = async (req, res) => {
    try {
        const { name, username, email, phoneNo, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });

        if (!name) {
            return res.status(422).json({ success: false, message: "name fields are required!" });
        }

        if (!username) return res.status(422).json({ success: false, message: "Username is required!" });

        if (!email) {
            return res.status(422).json({ success: false, message: "email fields are required!" });
        }

        if (!phoneNo) {
            return res.status(422).json({ success: false, message: "phone no fields are required!" });
        }

        if (!password) {
            return res.status(422).json({ success: false, message: "Password fields are required!" });
        }

        if (!req.file) {
            return res.status(422).json({ success: false, message: "Please upload a profile image!" });
        }

        if (name.trim().length === 0) {
            return res.status(422).json({ success: false, message: "Name cannot be empty or just spaces!" });
        }

        if (name.length < 3 || name.length > 20) {
            return res.status(422).json({ success: false, message: "Name must be between 3 and 20 characters long!" });
        }

        const nameValidation = /^[a-zA-Z\s'-]+$/;
        if (!nameValidation.test(name.trim())) {
            return res.status(422).json({ success: false, message: "Name can only contain letters, spaces, apostrophes, or hyphens!" });
        }

        const usernameValidation = /^[a-zA-Z0-9_]{3,20}$/; // Alphanumeric + underscore, 3–20 characters
        if (!usernameValidation.test(username)) {
            return res.status(422).json({
                success: false,
                message: "Username must be 3–20 characters and contain only letters, numbers, or underscores.",
            });
        }

        const emailValidation = /^(?![.-])[a-zA-Z0-9.-]+@(gmail|yahoo|hotmail)\.com(?<![.-])$/;
        if (!emailValidation.test(email)) {
            return res.status(422).json({ success: false, message: "Invalid email format!" });
        }

        if (existingUser) {
            return res.status(409).json({ success: false, message: "Oops! This email is already in use." });
        }

        const isValidPhone = /^\d{10}$/.test(phoneNo);
        if (!isValidPhone) {
            return res.status(422).json({ success: false, message: "Invalid phone number. Must be a 10-digit number." });
        }

        const passwordValidation = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordValidation.test(password)) {
            return res.status(422).json({ success: false, message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name: name.trim(),
            username: username.trim().toLowerCase(),
            email,
            phoneNo,
            password: hashedPassword,
            profile_image: req.file.filename,
        });

        res.status(201).json({
            success: true,
            message: "User registration successful!",
            result: newUser,
        });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const login = async (req, res) => {
    try {
        // const { email, phoneNo, password } = req.body;
        // let user;

        // if (email) {
        //     user = await User.findOne({ where: { email } });
        // } else if (phoneNo) {
        //     user = await User.findOne({ where: { phoneNo } });
        // } else {
        //     return res.status(400).json({ success: false, message: "Email or phoneNo is required." });
        // }

        // if (!user) {
        //     return res.status(401).json({ success: false, message: "Invalid email or phoneNo." });
        // }

        // if (!password) {    
        //     return res.status(422).json({ success: false, message: "Please enter password is required!" });
        // }

        // const matchPassword = await bcrypt.compare(password, user.password);
        // if (!matchPassword) {
        //     return res.status(401).json({ success: false, message: "Invalid credentials!" });
        // }

        // if (user.isDeleted) {
        //     return res.status(400).json({ success: false, message: "User does not exist!" });
        // }

        // user.isDeleted = false;
        // await user.save();

        // const jwtToken = jwt.sign(
        //     { id: user.id, email: user.email },
        //     process.env.JWT_SECRET || "PM@123$",
        //     { expiresIn: "1d" }
        // );

        // res.status(200).json({
        //     success: true,
        //     message: "Login successful!",
        //     jwtToken,
        // });

        const { identifier, password } = req.body;
        const trimmedIdentifier = identifier.trim();

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: "Identifier and password are required." });
        }

        const isEmail = /^(?![.-])[a-zA-Z0-9.-]+@(gmail|yahoo|hotmail)\.com(?<![.-])$/.test(trimmedIdentifier);
        const isPhone = /^\d{10}$/.test(trimmedIdentifier);
        const isUsername = /^[a-zA-Z0-9_]{3,30}$/.test(trimmedIdentifier); 

        let user;

        if (isEmail) {
            user = await User.findOne({ where: { email: trimmedIdentifier } });
        } else if (isPhone) {
            user = await User.findOne({ where: { phoneNo: trimmedIdentifier } });
        } else if (isUsername) {
            user = await User.findOne({ where: { username: trimmedIdentifier } });
        } else {
            return res.status(400).json({ success: false, message: "Invalid email, phone number, or username format." });
        }

        if (!user || user.isDeleted) {
            return res.status(401).json({ success: false, message: "User not found." });
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(401).json({ success: false, message: "Invalid credentials!" });
        }

        await user.save();

        const jwtToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "PM@123$",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful!",
            jwtToken,
        });

    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user || user.isDeleted) {
            return res.status(400).json({ success: false, message: "User is not found." });
        }

        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            result: user,
        });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};

const userUpdate = async (req, res) => {
    try {
        const { name, phoneNo } = req.body;
        const profileImageFilename = req.file?.filename;

        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user || user.isDeleted) {
            if (req.file) {
                fs.unlink(path.join(__dirname, "../../../uploads", req.file.filename), (err) => {
                    if (err) console.error("Error deleting uploaded file:", err);
                });
            }
            return res.status(404).json({ success: false, message: "User is not found." });
        }

        if (name && name.trim().length === 0) {
            return res.status(422).json({ success: false, message: "Name cannot be empty or just spaces!" });
        }

        if (name && (name.length < 3 || name.length > 20)) {
            return res.status(422).json({ success: false, message: "Name must be between 3 and 20 characters long!" });
        }

        const nameValidation = /^[a-zA-Z\s'-]+$/;
        if (name && !nameValidation.test(name.trim())) {
            return res.status(422).json({ success: false, message: "Name can only contain letters, spaces, apostrophes, or hyphens!" });
        }

        const isValidPhone = /^\d{10}$/.test(phoneNo);
        if (!isValidPhone) {
            return res.status(422).json({ success: false, message: "Invalid phone number. Must be a 10-digit number." });
        }

        const oldProfileImage = user.profile_image;

        const updatedData = {
            name: name || user.name,
            phoneNo: phoneNo || user.phoneNo,
            profile_image: profileImageFilename || user.profile_image,
        };

        await user.update(updatedData);

        if (req.file && oldProfileImage) {
            const oldImagePath = path.join(__dirname, "../../../uploads", oldProfileImage);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error deleting old profile image:", err);
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            result: user,
        });
    } catch (e) {
        if (req.file) {
            fs.unlink(path.join(__dirname, "../../../uploads", req.file.filename), (err) => {
                if (err) console.error("Error deleting uploaded file:", err);
            });
        }
        res.status(500).json({ success: false, message: e.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        const userTodos = await Todo.findAll({ where: { userId } });


        if (!user || user.isDeleted) {
            return res.status(404).json({ success: false, message: "User is not found." });
        }

        if (userTodos.length > 0) {
            const hasActiveTodos = userTodos.filter(todo => todo.isDeleted !== true).length > 0;
            if (hasActiveTodos) {
                return res.status(400).json({ success: false, message: "User has associated todos and cannot be deleted." });
            }
        }

        const oldProfileImage = user.profile_image;

        await user.update({
            session_expired: true,
            isDeleted: true,
            deletedAt: new Date(),
        });

        if (oldProfileImage) {
            const oldImagePath = path.join(__dirname, "../../../uploads", oldProfileImage);
            fs.unlink(oldImagePath, (err) => {
                if (err) console.error("Error deleting old profile image:", err);
            });
        }

        res.status(200).json({
            success: true,
            message: "User account deleted successfully.",
            result: user,
        });
    } catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};



module.exports = {
    signup,
    login,
    getUser,
    userUpdate,
    deleteUser
};