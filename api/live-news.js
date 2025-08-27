// api/live-news.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEWS_API_KEY; // Set this in Vercel dashboard
    const url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=10&apiKey=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`NewsAPI error: ${response.status}`);

    const data = await response.json();

    // Return only the articles array
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow front-end fetch
    res.status(200).json(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
