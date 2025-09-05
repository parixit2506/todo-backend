const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {

    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided." });
    }   

    jwt.verify(token, process.env.JWT_SECRET || "PM@123$", (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Failed to authenticate token." });
        }
        req.user = decoded;
        next();
    });
}

module.exports = authenticate;