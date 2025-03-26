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

// Toggle using Gemini from .env
const useGemini = process.env.USE_GEMINI === "true";

app.get("/ping", (req, res) => {
  console.log("Ping endpoint hit");
  res.json({ message: "pong" });
});

// /chat endpoint updated to use conversation history
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const historyFromClient = req.body.history || [];
  const inventory = req.body.inventory || "none";
  const inventoryText = JSON.stringify(inventory, null, 2);

  // Map the history to Gemini's expected format:
  const convertedHistory = historyFromClient.map((msg) => {
    return {
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    };
  });

  // Append the current user message (if not already in history)
  // In our client code we already include it, but you can double-check or merge as needed.
  // For this example, assume it’s included.

  // Add a system instruction for context:
  const systemInstruction = {
    role: "system",
    parts: [{
      text: `You are Culina, a friendly cooking helper chatbot. Use the user's inventory: ${inventoryText} to guide your responses.`,
    }],
  };

  // Build the payload that includes the system instruction and conversation history:
  const payload = {
    contents: [
      systemInstruction,
      ...convertedHistory,
    ],
    generationConfig: {
      maxOutputTokens: 150,
      temperature: 0.7,
    },
  };

  console.log("Using payload:", JSON.stringify(payload, null, 2));

  // If not using Gemini, return a static response:
  if (!useGemini) {
    return res.json({ response: staticChatResponse });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    console.log("API response:", JSON.stringify(response.data, null, 2));

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
