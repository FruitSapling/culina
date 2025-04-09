// server.js
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import { staticChatResponse } from "./staticChatResponse.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const useGemini = process.env.USE_GEMINI === "true";

app.use(cors({ origin: "*", methods: "GET,HEAD,PUT,PATCH,POST,DELETE" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// --- Health Check ---
app.get("/ping", (req, res) => {
  console.log("Ping endpoint hit");
  res.json({ message: "pong" });
});

// --- /images: Fetch ingredient image from Pexels ---
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
    const imageUrl =
      data.photos?.[0]?.src?.medium || "https://via.placeholder.com/60?text=No+Image";

    res.json({ imageUrl });
  } catch (error) {
    console.error("Error fetching image from Pexels:", error.message);
    res.status(500).json({ error: "Failed to fetch image." });
  }
});

// --- /ingredients-from-image: Gemini Pro Vision image analysis ---
app.post("/ingredients-from-image", async (req, res) => {
  const { base64Image, mimeType } = req.body;

  if (!base64Image || !mimeType) {
    return res.status(400).json({ error: "Missing image or mimeType" });
  }

  const base64Stripped = base64Image.split(",")[1];

  console.log("🔍 Incoming image data:");
  console.log("  - mimeType:", mimeType);
  console.log("  - base64 length:", base64Stripped.length);
  console.log("  - first 100 chars:", base64Stripped.slice(0, 100));

  const payload = {
    contents: [
      {
        parts: [
          {
            text: "List all food ingredients you see in this photo. Respond with a comma-separated list. No sentences, just words like carrots, potatoes, tinned tomatoes",
          },
          {
            inlineData: {
              mimeType,
              data: base64Stripped,
            },
          },
        ],
      },
    ],
  };

  console.log("📦 Payload size (JSON):", JSON.stringify(payload).length, "chars");

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const ingredients = rawText
      .split(",")
      .map((i) => i.trim().toLowerCase())
      .filter(Boolean);

    console.log("✅ Gemini returned ingredients:", ingredients);
    res.json({ ingredients });
  } catch (error) {
    console.error("❌ Gemini Vision error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to process image." });
  }
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  const historyFromClient = req.body.history || [];
  const inventory = req.body.inventory || [];
  const inventoryText = JSON.stringify(inventory, null, 2);

  // Convert existing chat history
  const convertedHistory = historyFromClient.map((msg) => ({
    role: msg.sender === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  const hasPromptAlready = convertedHistory.some((msg) =>
    msg.parts[0].text.includes("You are Culina")
  );

  // If the instruction isn't already in the history, inject it once
  if (!hasPromptAlready) {
    const instructionText = `
You are Culina, a friendly cooking helper chatbot. Use the user's inventory: ${inventoryText} to guide your responses.
Give concise suggestions for recipes that use those ingredients. Ask clarifying questions if needed.
Avoid being cringey, be calm and helpful.
    `.trim();

    convertedHistory.unshift({
      role: "model", // not "system", since Gemini doesn't support "system" role
      parts: [{ text: instructionText }],
    });
  }

  // Add latest user message
  convertedHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  const payload = {
    contents: convertedHistory,
    generationConfig: {
      maxOutputTokens: 1000,
      temperature: 0.7,
    },
  };

  if (!useGemini) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return res.json({ response: staticChatResponse });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    const aiResponse =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, something went wrong.";
    res.json({ response: aiResponse });
  } catch (error) {
    console.error(
      "Gemini chat error:",
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
    res.status(500).json({ error: "Error processing chat request" });
  }
});


app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
