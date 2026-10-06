import jwt from "jsonwebtoken";
import process from "node:process";

import Session from "../models/Session.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. No token provided."
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Check that the JWT contains a session ID
    if (!decoded.sessionId) {
      return res.status(401).json({
        message: "Not authorized. Session information missing."
      });
    }

    // Check the session in MongoDB
    const session = await Session.findOne({
      sessionId: decoded.sessionId,
      userId: decoded.userId,
      status: "ACTIVE"
    });

    if (!session) {
      return res.status(401).json({
        message: "Session is no longer active."
      });
    }

    // Attach information to request
    req.userId = decoded.userId;
    req.sessionId = decoded.sessionId;

    // Update last activity
    session.lastActivity = new Date();
    await session.save();

    next();
  } catch {
    return res.status(401).json({
      message: "Not authorized. Invalid or expired token."
    });
  }
};

export default protect;