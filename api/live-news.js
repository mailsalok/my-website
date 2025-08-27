import fetch from "node-fetch";

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "NEWS_API_KEY not set in environment" });
  }

  // You can add more sources or countries as needed
  const url = `https://newsapi.org/v2/top-headlines?country=us&language=en&pageSize=20&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("NewsAPI fetch failed");

    const data = await response.json();
    res.status(200).json(data.articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
