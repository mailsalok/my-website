// File: api/live-news.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY; // Vercel environment variable
  const url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=20&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.articles) {
      return res.status(500).json({ error: "No articles found" });
    }

    res.status(200).json(data.articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
