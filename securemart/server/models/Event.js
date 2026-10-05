import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    sessionId: {
      type: String,
      default: null
    },

    eventType: {
      type: String,
      required: true,
      enum: [
        "LOGIN_SUCCESS",
        "LOGIN_FAILED",
        "SESSION_STARTED",
        "SESSION_ENDED",
        "PRODUCT_VIEW",
        "PRODUCT_SEARCH",
        "PRODUCT_FILTER",
        "CART_ADD",
        "CART_REMOVE",
        "CHECKOUT_STARTED",
        "ORDER_CREATED",
        "LOGOUT",
        "API_REQUEST",
        "SUSPICIOUS_ACTIVITY"
      ]
    },

    timestamp: {
      type: Date,
      default: Date.now
    },

    ipAddress: {
      type: String,
      default: null
    },

    userAgent: {
      type: String,
      default: null
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;