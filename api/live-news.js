export default async function handler(req, res) {
  const API_KEY = "3dcd750c94194e78a3255a954efaf97a"; // your NewsAPI key
  const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch news");
    const data = await response.json();
    const articles = data.articles.slice(0, 10); // top 10
    res.status(200).json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch live news" });
  }
}
