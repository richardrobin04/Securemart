import Event from "../models/Event.js";

const getEventSummary = async ({
  userId = null,
  sessionId = null,
  minutes = 10
}) => {
  try {
    const startTime = new Date(
      Date.now() - minutes * 60 * 1000
    );

    const filter = {
      timestamp: {
        $gte: startTime
      }
    };

    // If a user is provided, only aggregate that user's events
    if (userId) {
      filter.userId = userId;
    }

    // If a session is provided, only aggregate that session's events
    if (sessionId) {
      filter.sessionId = sessionId;
    }

    const events = await Event.find(filter).lean();

    const summary = {
      timeWindowMinutes: minutes,
      totalEvents: events.length,

      failedLogins: 0,
      successfulLogins: 0,

      apiRequests: 0,
failedRequestCount: 0,
totalResponseTime: 0,
averageResponseTime: 0,
suspiciousEvents: 0,
lastThreatType: null,
lastThreatSeverity: null,
lastSecurityEvent: null,
      productViews: 0,
      productSearches: 0,

      cartAdds: 0,
cartRemoves: 0,
checkoutStarted: 0,
ordersCreated: 0,
totalOrderValue: 0,
lastOrderTime: null,

      uniqueIPs: new Set()
    };

    for (const event of events) {
      switch (event.eventType) {
        case "LOGIN_FAILED":
          summary.failedLogins++;
          break;

        case "LOGIN_SUCCESS":
          summary.successfulLogins++;
          break;

        case "API_REQUEST":
  summary.apiRequests++;

  if (event.metadata?.statusCode >= 400) {
    summary.failedRequestCount++;
  }

  if (typeof event.metadata?.responseTime === "number") {
    summary.totalResponseTime += event.metadata.responseTime;
  }

  break;

        case "SUSPICIOUS_ACTIVITY":
  summary.suspiciousEvents++;

  if (
    !summary.lastSecurityEvent ||
    new Date(event.timestamp) >
      new Date(summary.lastSecurityEvent)
  ) {
    summary.lastSecurityEvent = event.timestamp;

    summary.lastThreatType =
      event.metadata?.threatType || null;

    summary.lastThreatSeverity =
      event.metadata?.severity || null;
  }

  break;

        case "PRODUCT_VIEW":
          summary.productViews++;
          break;

        case "PRODUCT_SEARCH":
          summary.productSearches++;
          break;

        case "CART_ADD":
          summary.cartAdds++;
          break;

        case "CART_REMOVE":
          summary.cartRemoves++;
          break;

        case "CHECKOUT_STARTED":
          summary.checkoutStarted++;
          break;

        case "ORDER_CREATED":
  summary.ordersCreated++;

  if (
    typeof event.metadata?.totalAmount === "number"
  ) {
    summary.totalOrderValue +=
      event.metadata.totalAmount;
  }

  if (!summary.lastOrderTime) {
    summary.lastOrderTime = event.timestamp;
  }

  break;

        default:
          break;
      }

      if (event.ipAddress) {
        summary.uniqueIPs.add(event.ipAddress);
      }
    }

    if (summary.apiRequests > 0) {
  summary.averageResponseTime =
    summary.totalResponseTime / summary.apiRequests;
}

    summary.uniqueIPCount = summary.uniqueIPs.size;

    delete summary.uniqueIPs;

    return summary;

  } catch (error) {
    console.error(
      "Event aggregation error:",
      error.message
    );

    throw error;
  }
};

export default getEventSummary;