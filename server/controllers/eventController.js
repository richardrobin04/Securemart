import logEvent from "../services/eventLogger.js";

// ==========================================
// LOG FRONTEND EVENT
// ==========================================

export const createEvent = async (req, res) => {
  try {
    const {
      eventType,
      metadata = {}
    } = req.body;

    if (!eventType) {
      return res.status(400).json({
        message: "eventType is required"
      });
    }

    const allowedEvents = [
      "PRODUCT_VIEW",
      "PRODUCT_SEARCH",
      "PRODUCT_FILTER",
      "CART_ADD",
      "CART_REMOVE",
      "CHECKOUT_STARTED",
      "ORDER_CREATED"
    ];

    if (!allowedEvents.includes(eventType)) {
      return res.status(400).json({
        message: "Invalid event type"
      });
    }

    const event = await logEvent({
      userId: req.userId,
      sessionId: req.sessionId,
      eventType,
      req,
      metadata
    });

    res.status(201).json({
      message: "Event logged successfully",
      eventId: event._id
    });

  } catch (error) {
    console.error(
      "Event creation error:",
      error
    );

    res.status(500).json({
      message: "Server error while logging event"
    });
  }
};

// ==========================================
// GET LOGGED-IN USER ORDERS
// ==========================================

export const getMyOrders = async (req, res) => {
  try {
    const Event = (await import("../models/Event.js")).default;

    const orders = await Event.find({
      userId: req.userId,
      eventType: "ORDER_CREATED"
    })
      .sort({ timestamp: -1 })
      .lean();

    res.status(200).json({
      orders
    });

  } catch (error) {
    console.error(
      "Get orders error:",
      error
    );

    res.status(500).json({
      message: "Server error while fetching orders"
    });
  }
};