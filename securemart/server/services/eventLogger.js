import Event from "../models/Event.js";

// ==========================================
// CENTRAL EVENT LOGGER
// ==========================================

const logEvent = async ({
  userId = null,
  sessionId = null,
  eventType,
  req,
  metadata = {}
}) => {
  try {
    // Get IP address
    const ipAddress =
      req?.headers?.["x-forwarded-for"] ||
      req?.socket?.remoteAddress ||
      null;

    // Get browser / client information
    const userAgent =
      req?.headers?.["user-agent"] ||
      null;

    // Create event
    const event = await Event.create({
      userId,
      sessionId,
      eventType,
      ipAddress,
      userAgent,
      metadata,
      timestamp: new Date()
    });

    console.log(
      `[EVENT] ${eventType} | User: ${userId || "anonymous"} | Session: ${sessionId || "none"}`
    );

    return event;

  } catch (error) {
    console.error(
      `[EVENT LOGGER ERROR] ${eventType}:`,
      error.message
    );

    throw error;
  }
};

export default logEvent;