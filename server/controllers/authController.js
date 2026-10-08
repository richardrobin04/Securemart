import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "node:process";
import crypto from "node:crypto";
import { v4 as uuidv4 } from "uuid";

import User from "../models/user.js";
import Session from "../models/Session.js";
import logEvent from "../services/eventLogger.js";
import detectBruteForce from "../services/suspiciousActivity.js";
import updateDigitalTwin from "../services/digitalTwinService.js";

// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (userId, sessionId) => {
  return jwt.sign(
    {
      userId,
      sessionId
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    // Create session
    const sessionId = uuidv4();

    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      null;

    const userAgent =
      req.headers["user-agent"] || null;

    await Session.create({
      userId: user._id,
      sessionId,
      ipAddress,
      userAgent
    });

    // Generate JWT
    const token = generateToken(
      user._id.toString(),
      sessionId
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Server error during registration"
    });
  }
};

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --------------------------------------
    // Check required fields
    // --------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // --------------------------------------
    // Find user
    // --------------------------------------

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    // --------------------------------------
    // User not found
    // --------------------------------------

    if (!user) {
      await logEvent({
        eventType: "LOGIN_FAILED",
        req,
        metadata: {
  email: email.toLowerCase(),
  loginMethod: "PASSWORD",
  failureReason: "USER_NOT_FOUND"
}
      });

      await detectBruteForce({
  req,
  email
});

      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    
const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  await logEvent({
    eventType: "LOGIN_FAILED",
    req,
    metadata: {
      email: email.toLowerCase()
    }
  });

  await detectBruteForce({
  req,
  email,
  userId: user._id
});

  return res.status(401).json({
    message: "Invalid email or password"
  });
}
    // --------------------------------------
    // Check account status
    // --------------------------------------

    if (!user.isActive) {
      return res.status(403).json({
        message: "This account has been disabled"
      });
    }

    // --------------------------------------
    // Compare password
    // --------------------------------------

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // --------------------------------------
    // Wrong password
    // --------------------------------------

    if (!passwordMatch) {
      await logEvent({
        userId: user._id,
        eventType: "LOGIN_FAILED",
        req,
        metadata: {
  email: email.toLowerCase(),
  loginMethod: "PASSWORD",
  failureReason: "INVALID_PASSWORD"
}
      });

      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // --------------------------------------
    // Successful login
    // --------------------------------------

    console.log(
      "===== SUCCESSFUL LOGIN PATH REACHED ====="
    );

    // --------------------------------------
    // Create unique session
    // --------------------------------------

    const sessionId = uuidv4();

    // --------------------------------------
    // Get client information
    // --------------------------------------

    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      null;

    const userAgent =
      req.headers["user-agent"] || null;

    // --------------------------------------
    // Create session
    // --------------------------------------

    await Session.create({
      userId: user._id,
      sessionId,
      ipAddress,
      userAgent
    });

    // --------------------------------------
    // Log successful login event
    // --------------------------------------

    console.log(
      "===== ABOUT TO CALL LOGIN_SUCCESS LOGGER ====="
    );

    await logEvent({
      userId: user._id,
      sessionId,
      eventType: "LOGIN_SUCCESS",
      req
    });

    console.log(
      "===== LOGIN_SUCCESS LOGGER FINISHED ====="
    );

    await updateDigitalTwin({
  userId: user._id,
  sessionId: sessionId
});

    // --------------------------------------
    // Generate JWT
    // --------------------------------------

    const token = generateToken(
      user._id.toString(),
      sessionId
    );

    // --------------------------------------
    // Send response
    // --------------------------------------

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login"
    });
  }
};

// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    // Do not reveal whether an account exists
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset request has been created."
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Token expires in 15 minutes
    const resetTokenExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;

    await user.save();

    console.log(
      "Password reset token generated for:",
      normalizedEmail
    );

    // Development/demo only
    console.log(
      "RESET TOKEN:",
      resetToken
    );

    res.status(200).json({
      message:
        "If an account exists with this email, a password reset request has been created.",
      resetToken
    });

  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while processing password reset request"
    });
  }
};


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (req, res) => {
  try {
    const {
      token,
      newPassword
    } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        message:
          "Reset token and new password are required"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long"
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {
        $gt: new Date()
      }
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid or expired password reset token"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    user.password = hashedPassword;

    // Invalidate the reset token
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully"
    });

  } catch (error) {
    console.error(
      "Reset password error:",
      error
    );

    res.status(500).json({
      message:
        "Server error while resetting password"
    });
  }
};