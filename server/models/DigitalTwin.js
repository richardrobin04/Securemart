import mongoose from "mongoose";

const digitalTwinSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // User state
    userState: {
      accountStatus: {
        type: String,
        default: "ACTIVE"
      },
      lastLogin: {
        type: Date,
        default: null
      },
      failedLoginCount: {
        type: Number,
        default: 0
      }
    },

    // Session state
    sessionState: {
      activeSessions: {
        type: Number,
        default: 0
      },
      currentSessionId: {
        type: String,
        default: null
      },
      lastActivity: {
        type: Date,
        default: null
      }
    },

    // API / service state
    apiState: {
      requestCount: {
        type: Number,
        default: 0
      },
      failedRequestCount: {
        type: Number,
        default: 0
      },
      averageResponseTime: {
        type: Number,
        default: 0
      }
    },

    // Transaction state
    transactionState: {
  cartValue: {
    type: Number,
    default: 0
  },
  cartAddCount: {
    type: Number,
    default: 0
  },
  cartRemoveCount: {
    type: Number,
    default: 0
  },
  checkoutCount: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  },
  totalOrderValue: {
    type: Number,
    default: 0
  },
  lastOrderTime: {
    type: Date,
    default: null
  }
},

    // Security state
    securityState: {
      suspiciousEvents: {
        type: Number,
        default: 0
      },
      lastThreatType: {
        type: String,
        default: null
      },
      threatSeverity: {
        type: String,
        default: "LOW"
      },
      lastSecurityEvent: {
        type: Date,
        default: null
      }
    },

    // Risk state
    riskState: {
      score: {
        type: Number,
        default: 0
      },
      band: {
        type: String,
        enum: [
          "LOW",
          "MEDIUM",
          "HIGH",
          "CRITICAL"
        ],
        default: "LOW"
      },
      lastCalculated: {
        type: Date,
        default: null
      }
    },

    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const DigitalTwin = mongoose.model(
  "DigitalTwin",
  digitalTwinSchema
);

export default DigitalTwin;