// api/live-news.js
export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=3dcd750c94194e78a3255a954efaf97a`
    );
    const data = await response.json();
    res.status(200).json(data.articles || []);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
