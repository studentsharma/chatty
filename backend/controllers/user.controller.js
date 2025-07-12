import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const getFriends = async (req, res) => {

    const { user: username } = req.params;

    try {
        let user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        let friends = user.friends;
        if (!friends || friends.length === 0) {
            return res.status(404).json({ message: "No friends found" });
        }
        else {
            res.status(200).json(friends);
        }
    }
    catch (error) {
        console.log("error in sending friends list")
    }
}

const createUser = async (req, res) => {

    const { username, password } = req.body;

    if (!username) return res.status(400).json({ message: "Username required" });

    try {
        const userExists = await userModel.findOne({ username });
        if (userExists) return res.status(200).json(userExists);

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ username, password: hashedPassword });
        const token = jwt.sign({ id: newUser._id, username }, process.env.JWT_SECRET, { expiresIn: "10m" });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    try {

        let user = await userModel.findOne({ username });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, username }, process.env.JWT_SECRET, { expiresIn: "10m" });

        console.log(token);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Lax", 
            secure: false,       
            maxAge: 10 * 60 * 1000,
        });
        res.status(200).json({ user, token });

    }
    catch (error) {
        res.status(500).json({ msg: error });
        console.log("error in login");
    }
}

const getUsers = async (req, res) => {

    try {
        let user = await userModel.find();
        if (!user || user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(201).json(user);
    }
    catch (error) {
        console.log("error in sending user list")
    }
}

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, 
  });
  res.status(200).json({ message: "Logged out successfully" });
};


export { getFriends, createUser, login, getUsers, logout };