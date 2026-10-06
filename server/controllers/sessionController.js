import Session from "../models/Session.js";
import logEvent from "../services/eventLogger.js";

// ==========================================
// LOGOUT USER
// ==========================================

export const logoutUser = async (req, res) => {
  try {
    const { userId, sessionId } = req;

    // Check session ID
    if (!sessionId) {
      return res.status(400).json({
        message: "Session ID not found"
      });
    }

    // Find active session
    const session = await Session.findOne({
      sessionId,
      userId,
      status: "ACTIVE"
    });

    if (!session) {
      return res.status(404).json({
        message: "Active session not found"
      });
    }

    // End session
    session.status = "ENDED";
    session.endTime = new Date();
    session.lastActivity = new Date();

    await session.save();

    // Log logout event
    await logEvent({
      userId,
      sessionId,
      eventType: "LOGOUT",
      req
    });

    // Log session ended event
    await logEvent({
      userId,
      sessionId,
      eventType: "SESSION_ENDED",
      req,
      metadata: {
        startTime: session.startTime,
        endTime: session.endTime
      }
    });

    res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    console.error("Logout error:", error);

    res.status(500).json({
      message: "Server error during logout"
    });
  }
};