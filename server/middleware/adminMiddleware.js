
import User from "../models/user.js";

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("role isActive");

    if (!user || !user.isActive) {
      return res.status(403).json({
        message: "Access denied. User is unavailable.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Administrator privileges required.",
      });
    }

    return next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    return res.status(500).json({
      message: "Unable to verify administrator privileges.",
    });
  }
};

export default requireAdmin;