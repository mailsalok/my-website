import fetch from "node-fetch";

export default async function handler(req, res) {
  const API_KEY = "3dcd750c94194e78a3255a954efaf97a"; // your NewsAPI key
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const articles = data.articles.slice(0, 10); // top 10 articles
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch live news" });
  }
}
