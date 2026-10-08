import Event from "../models/Event.js";
import logEvent from "./eventLogger.js";

const detectBruteForce = async ({
  req,
  email,
  userId = null
}) => {
  try {
    const tenMinutesAgo = new Date(
      Date.now() - 10 * 60 * 1000
    );

    // Check failed attempts for the same email
    const failedAttemptsByEmail = await Event.countDocuments({
      eventType: "LOGIN_FAILED",
      timestamp: {
        $gte: tenMinutesAgo
      },
      "metadata.email": email
    });

    // Check failed attempts from the same IP
    const failedAttemptsByIP = await Event.countDocuments({
      eventType: "LOGIN_FAILED",
      timestamp: {
        $gte: tenMinutesAgo
      },
      ipAddress: req.ip
    });

    console.log(
      "Brute-force check:",
      email,
      "Email attempts:",
      failedAttemptsByEmail,
      "IP attempts:",
      failedAttemptsByIP
    );

    // Trigger suspicious activity if either condition is met
    if (
      failedAttemptsByEmail >= 5 ||
      failedAttemptsByIP >= 10
    ) {
      await logEvent({
  userId,
  sessionId: null,
  eventType: "SUSPICIOUS_ACTIVITY",
        req,
        metadata: {
          threatType: "BRUTE_FORCE",
          email,
          failedAttemptsByEmail,
          failedAttemptsByIP,
          timeWindow: "10 minutes",
          severity: "HIGH"
        }
      });

      console.log(
        `Suspicious activity detected from IP: ${req.ip}`
      );

      return true;
    }

    return false;

  } catch (error) {
    console.error(
      "Suspicious activity detection error:",
      error.message
    );

    return false;
  }
};

export default detectBruteForce;