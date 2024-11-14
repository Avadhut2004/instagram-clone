import jwt from "jsonwebtoken";

const isauthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            });
        }

        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                message: 'Invalid token',
                success: false
            });
        }

        req.id = decoded.userID; // Store the user ID in req object
        next(); // Move to the next middleware
    } catch (error) {
        console.log("Authentication error:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export default isauthenticated;
