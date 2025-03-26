// server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import { staticChatResponse } from "./staticChatResponse.js"; // Include the .js extension


dotenv.config();

const app = express();
// Allow all origins (or replace "*" with your specific origin if desired)
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Read toggle for using Gemini from an environment variable.
// When running locally, you can set this in a .env file.
const useGemini = process.env.USE_GEMINI === "true";

// Add this near the top of your routes in server.js:
app.get("/ping", (req, res) => {
  console.log("Ping endpoint hit");
  res.json({ message: "pong" });
});

// New endpoint to securely fetch an image from Pexels based on an ingredient name
app.get("/images", async (req, res) => {
  const ingredient = req.query.ingredient;
  if (!ingredient) {
    return res.status(400).json({ error: "Missing 'ingredient' query parameter." });
  }
  try {
    const response = await axios.get(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(ingredient)}&per_page=1`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    const data = response.data;
    if (data.photos && data.photos.length > 0) {
      const imageUrl = data.photos[0].src.medium;
      return res.json({ imageUrl });
    } else {
      return res.json({ imageUrl: "https://via.placeholder.com/60?text=No+Image" });
    }
  } catch (error) {
    console.error("Error fetching image from Pexels:", error.message);
    return res.status(500).json({ error: "Failed to fetch image." });
  }
});

// Existing /chat endpoint for Gemini
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  // Expect inventory to be passed; otherwise default to "none"
  const inventory = req.body.inventory || "none";
  const inventoryText = JSON.stringify(inventory, null, 2);

  // Build a prompt for Gemini
  const prompt = `You are Culina, a friendly cooking helper chatbot. Your responses must always be appropriate for a cooking helper, offering recipe recommendations, cooking tips, and guidance based on the user's available ingredients. The user's current inventory is: ${inventoryText}. Based on that, answer the following question: ${userMessage}`;

  console.log("Using prompt:", prompt);

  // If not using Gemini (for debugging), return a static response:
  if (!useGemini) {
    return res.json({
      response:
        staticChatResponse,
    });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("API response:", JSON.stringify(response.data, null, 2));

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content
    ) {
      const aiResponse = response.data.candidates[0].content.parts[0].text;
      res.json({ response: aiResponse });
    } else {
      console.error("Unexpected API response structure:", JSON.stringify(response.data, null, 2));
      res.status(500).json({ error: "Unexpected API response structure" });
    }
  } catch (error) {
    console.error(
      "Error while processing request:",
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
    res.status(500).json({ error: "Error processing request" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
