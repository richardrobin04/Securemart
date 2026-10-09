
import express from "express";
import protect from "../middleware/authMiddleware.js";
import requireAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/assessment", protect, requireAdmin, async (req, res) => {
  const requestedLimit = Number.parseInt(req.query.limit ?? "100", 10);

  if (
    !Number.isInteger(requestedLimit) ||
    requestedLimit < 1 ||
    requestedLimit > 500
  ) {
    return res.status(400).json({
      message: "Limit must be an integer between 1 and 500.",
    });
  }

  try {
    
const pythonResponse = await fetch(
  `http://127.0.0.1:8000/assess/recent?limit=${requestedLimit}`,
  {
    method: "POST",
    signal: AbortSignal.timeout(15000),
  }
);

    const contentType = pythonResponse.headers.get("content-type") || "";
    const responseText = await pythonResponse.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "Python engine returned non-JSON:",
        responseText.slice(0, 300)
      );

      return res.status(502).json({
        message: "The Python engine returned an invalid response.",
        engineStatus: pythonResponse.status,
      });
    }

    if (!pythonResponse.ok) {
      return res.status(502).json({
        message: "The risk assessment engine returned an error.",
        engineStatus: pythonResponse.status,
        details: data,
      });
    }

    return res.json(data);
  } catch (error) {
    console.error("Security assessment request failed:", error);

    return res.status(502).json({
      message:
        "Unable to reach the Python risk assessment engine. Check that it is running on port 8000.",
    });
  }
});

export default router;