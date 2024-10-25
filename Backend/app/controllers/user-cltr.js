import User from "../models/user-model.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
const userCltr = {}

userCltr.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }
    const PROFILE_PICS = ["/avatar1.png","/avatar2.png","/avatar3.png"]
    const image = PROFILE_PICS[Math.floor(Math.random()* PROFILE_PICS.length)]

    const { username,email, password } = req.body;
    try {
        const usersCount = await User.countDocuments();
        const user = new User({ username, email, password,image:image});
        const salt = await bcryptjs.genSalt();
        const hashed = await bcryptjs.hash(user.password, salt);
        user.password = hashed;

        if (usersCount === 0) {
            user.role = 'admin';
        }

        await user.save();
        return res.status(201).json(user); 

    } catch (err) {
        return res.status(500).json(err); 
    }
};


userCltr.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body; 
    try{
        
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: "Invalid username or password" });
        }

        const isValid = await bcryptjs.compare(password, user.password);
        if (!isValid) {
            return res.status(404).json({ error: "Invalid username or password" });
        }

        const tokenData = { userId: user._id, role: user.role };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "60d" });
        return res.json({ token });

    } catch (err) {
        return res.status(500).json(err); 
    }
};



userCltr.account = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

export default userCltr

