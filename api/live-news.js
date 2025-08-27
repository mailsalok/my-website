// api/live-news.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key missing" });

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?language=en&pageSize=20&apiKey=${apiKey}`
    );
    if (!response.ok) throw new Error("Failed to fetch from NewsAPI");
    const data = await response.json();
    res.status(200).json(data.articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
