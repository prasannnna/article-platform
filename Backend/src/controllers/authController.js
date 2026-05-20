const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign(
        {userId}, process.env.JWT_SECRET, { expiresIn: '7d'}
    );
};

const signup = async (req, res) => {
    try {
        const { name, email, password, bio } = req.body;
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }
        if(password.length < 6) {
            return res.status(400).json({
                message: "Enter valid password with more than 6 characters"
            });
        }
        const user = new User( {
            name: name,
            email: email,
            password: password,
            bio: bio || ''
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "Successfully created user",
            token,
            user: user.getUserProfile(),
        });
    }
    catch(error) {
        console.log("Something went wrong at Signup", error.message);
        res.status(500).json({
            message: error.message
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message: "Enter email and password"
            });
        }

        const user = await User.findOne({ email }).select('+password');
        if(!user) {
            return res.status(400).json({
                message: "inavalid user or password"
            });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(400).json(
                {
                    message: "Enter valid password"
                }
            );
        }
         const token = generateToken(user._id);

        res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: user.getUserProfile(),
        });
    } 
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
        message: 'Server error during login', 
        error: error.message 
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if(!user) {
            return res.status(400).json({
                message: "Error getting User details"
            });
        }

        res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            user: user.getUserProfile()
        });
    } catch(error) {
        console.log("Error getiing user details", error.message);
        res.status(500).json({
            message: "Error fetching user details",
            error: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, bio, profilePicture } = req.body;
        
        const user = await User.findById(req.user.userId);
        
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: user.getUserProfile(),
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};


module.exports = {
    signup, login, getMe, updateProfile
};

