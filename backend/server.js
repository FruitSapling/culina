// server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import { staticChatResponse } from "./staticChatResponse.js"; // Include the .js extension

dotenv.config();

const app = express();
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Toggle for using Gemini (set USE_GEMINI=true in your .env file)
const useGemini = process.env.USE_GEMINI === "true";

app.get("/ping", (req, res) => {
  console.log("Ping endpoint hit");
  res.json({ message: "pong" });
});

// Example endpoint to fetch an image from Pexels (unchanged)
app.get("/images", async (req, res) => {
  const ingredient = req.query.ingredient;
  if (!ingredient) {
    return res.status(400).json({ error: "Missing 'ingredient' query parameter." });
  }
  try {
    const response = await axios.get(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(ingredient)}&per_page=1`,
      {
        headers: { Authorization: process.env.PEXELS_API_KEY },
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

// Updated /chat endpoint that uses conversation history without any "system" role
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const historyFromClient = req.body.history || [];
  const inventory = req.body.inventory || "none";
  const inventoryText = JSON.stringify(inventory, null, 2);

  // Convert the client history to the expected format (only "user" and "model" roles)
  const convertedHistory = historyFromClient.map((msg) => ({
    role: msg.sender === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  // Prepare the instruction text (guidance for the chatbot)
  const instructionText = `You are Culina, a friendly cooking helper chatbot. Use the user's inventory: ${inventoryText} to guide your responses. Prefer recipes that are a bit funky and interesting and non-standard.`;
  
  // Embed the instruction directly into the user's current message.
  const finalUserMessage = instructionText + userMessage;

  // Update the conversation history: replace the last user message (if any) with the finalUserMessage,
  // or append it if no user message is present.
  if (convertedHistory.length > 0 && convertedHistory[convertedHistory.length - 1].role === "user") {
    convertedHistory[convertedHistory.length - 1].parts[0].text = finalUserMessage;
  } else {
    convertedHistory.push({
      role: "user",
      parts: [{ text: finalUserMessage }],
    });
  }

  // Build the payload for Gemini.
  const payload = {
    contents: convertedHistory,
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.7,
    },
  };

  console.log("Using payload:", JSON.stringify(payload, null, 2));

  if (!useGemini) {
    return res.json({ response: staticChatResponse });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("Gemini API response:", JSON.stringify(response.data, null, 2));

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts &&
      response.data.candidates[0].content.parts[0]
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
