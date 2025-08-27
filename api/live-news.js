import fetch from "node-fetch";

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing NEWS_API_KEY env variable." });
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?language=en&pageSize=10&apiKey=${apiKey}`
    );
    if (!response.ok) throw new Error("Failed to fetch news.");
    const data = await response.json();
    return res.status(200).json(data.articles || []);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch news." });
  }
}
