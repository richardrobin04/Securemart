const API_BASE_URL = "http://localhost:5000/api";

// ==========================================
// GENERIC API REQUEST
// ==========================================

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("securemart_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers
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
// REGISTER
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
      password
    })
  });
};

// ==========================================
// LOGIN
// ==========================================

export const loginUser = async (
  email,
  password
) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password
    })
  });
};

// ==========================================
// GET PROFILE
// ==========================================

export const getProfile = async () => {
  return apiRequest("/users/profile", {
    method: "GET"
  });
};

// ==========================================
// LOGOUT
// ==========================================

export const logoutUser = async () => {
  return apiRequest("/sessions/logout", {
    method: "POST"
  });
};

export default {
  registerUser,
  loginUser,
  getProfile,
  logoutUser
};