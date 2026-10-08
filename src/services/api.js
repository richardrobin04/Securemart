const API_BASE_URL = "http://localhost:5000/api";

// ==========================================
// GENERIC API REQUEST
// ==========================================

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("securemart_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Attach JWT token if the user is logged in
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
};

// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (
  name,
  email,
  password
) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (
  email,
  password
) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const forgotPassword = async (email) =>
  apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  export const resetPassword = async (token, newPassword) =>
  apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({
      token,
      newPassword,
    }),
  });

// ==========================================
// GET USER PROFILE
// ==========================================

export const getProfile = async () => {
  return apiRequest("/users/profile", {
    method: "GET",
  });
};

// ==========================================
// LOGOUT USER
// ==========================================

export const logoutUser = async () => {
  return apiRequest("/sessions/logout", {
    method: "POST",
  });
};

// ==========================================
// DEFAULT EXPORT
// ==========================================

// LOG SECURITY / E-COMMERCE EVENT
export const logEvent = async (
  eventType,
  metadata = {}
) => {
  return apiRequest("/events", {
    method: "POST",
    body: JSON.stringify({
      eventType,
      metadata,
    }),
  });
};

export const getMyOrders = async () =>
  apiRequest("/events/orders", {
    method: "GET",
  });

export default {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProfile,
  logoutUser,
  logEvent,
  getMyOrders,
};