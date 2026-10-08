import logEvent from "../services/eventLogger.js";
import updateDigitalTwin from "../services/digitalTwinService.js";

const apiRequestLogger = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", async () => {
    const responseTime = Date.now() - startTime;

    try {
      await logEvent({
        userId: req.userId || null,
        sessionId: req.sessionId || null,
        eventType: "API_REQUEST",
        req,
        metadata: {
          method: req.method,
          endpoint: req.originalUrl,
          statusCode: res.statusCode,
          responseTime
        }
      });

      if (req.userId) {
  await updateDigitalTwin({
    userId: req.userId,
    sessionId: req.sessionId || null
  });
}
    } catch (error) {
      console.error(
        "API request logging error:",
        error.message
      );
    }
  });

  next();
};

export default apiRequestLogger;