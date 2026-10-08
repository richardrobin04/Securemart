import DigitalTwin from "../models/DigitalTwin.js";
import Session from "../models/Session.js";
import getEventSummary from "./eventAggregator.js";

const updateDigitalTwin = async ({
  userId,
  sessionId = null
}) => {
  try {
    const summary = await getEventSummary({
  userId,
  minutes: 10
});

    const activeSessions = await Session.countDocuments({
  userId,
  status: "ACTIVE"
});

const currentSession = sessionId
  ? await Session.findOne({
      sessionId,
      userId,
      status: "ACTIVE"
    }).lean()
  : null;

    const digitalTwin = await DigitalTwin.findOneAndUpdate(
      { userId },
      {
        $set: {
          "userState.failedLoginCount": summary.failedLogins,

          "sessionState.activeSessions": activeSessions,
"sessionState.currentSessionId": sessionId,
"sessionState.lastActivity": currentSession
  ? currentSession.lastActivity
  : null,

"apiState.requestCount": summary.apiRequests,

"apiState.failedRequestCount":
  summary.failedRequestCount,

"apiState.averageResponseTime":
  summary.averageResponseTime,

          "securityState.suspiciousEvents":
  summary.suspiciousEvents,

"securityState.lastThreatType":
  summary.lastThreatType,

"securityState.threatSeverity":
  summary.lastThreatSeverity || "LOW",

"securityState.lastSecurityEvent":
  summary.lastSecurityEvent,

          "transactionState.cartAddCount":
  summary.cartAdds,

"transactionState.cartRemoveCount":
  summary.cartRemoves,

"transactionState.checkoutCount":
  summary.checkoutStarted,

"transactionState.orderCount":
  summary.ordersCreated,

"transactionState.totalOrderValue":
  summary.totalOrderValue,

"transactionState.lastOrderTime":
  summary.lastOrderTime,

          lastUpdated: new Date()
        }
      },
      {
        new: true,
        upsert: true
      }
    );

    return digitalTwin;

  } catch (error) {
    console.error(
      "Digital Twin update error:",
      error.message
    );

    throw error;
  }
};

export default updateDigitalTwin;