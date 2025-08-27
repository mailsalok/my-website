import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    // List of countries and sources you want news from
    const urls = [
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`,
      `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`,
      `https://newsapi.org/v2/top-headlines?country=gb&apiKey=${process.env.NEWS_API_KEY}`,
      `https://newsapi.org/v2/top-headlines?country=au&apiKey=${process.env.NEWS_API_KEY}`
    ];

    const allArticles = [];

    for (const url of urls) {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch news: ${response.status}`);
      const data = await response.json();
      if (data.articles && data.articles.length > 0) {
        allArticles.push(...data.articles);
      }
    }

    // Optional: sort by published date descending
    allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    res.status(200).json(allArticles);
  } catch (err) {
    console.error("News API error:", err);
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
