// File: live-news.js
const container = document.getElementById("news-container");
const speakBtn = document.getElementById("speak-btn");
let articles = [];
let currentIndex = 0;
let synth = window.speechSynthesis;
let isReading = false;

// Fetch news from serverless function
async function fetchNews() {
  container.innerHTML = `<p class="loading">Loading news...</p>`;
  try {
    const res = await fetch("/api/live-news");
    if (!res.ok) throw new Error("Network error");
    articles = await res.json();
    if (!articles.length) {
      container.innerHTML = "<p>No news available.</p>";
    } else {
      showArticle(0);
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>⚠️ Failed to load news.</p>";
  }
}

// Display one article
function showArticle(index) {
  container.innerHTML = "";
  currentIndex = index;
  const article = articles[index];
  const card = document.createElement("div");
  card.className = "news-card";

  const image = article.urlToImage
    ? `<img src="${article.urlToImage}" alt="News Image" class="news-img">`
    : "";
  const description = article.description || "No description available.";

  card.innerHTML = `
    ${image}
    <div class="news-title">${article.title || "Untitled"}</div>
    <div class="news-description">${description}</div>
    <a href="${article.url}" target="_blank" class="news-link">Read More</a>
  `;
  container.appendChild(card);
}

// Navigation
function nextArticle() {
  if (!articles.length) return;
  const nextIndex = (currentIndex + 1) % articles.length;
  showArticle(nextIndex);
}

function prevArticle() {
  if (!articles.length) return;
  const prevIndex = (currentIndex - 1 + articles.length) % articles.length;
  showArticle(prevIndex);
}

// Speak current article
speakBtn.addEventListener("click", () => {
  if (!articles.length) return;

  if (isReading) {
    synth.cancel();
    isReading = false;
    speakBtn.textContent = "🔊 Speak News";
  } else {
    const article = articles[currentIndex];
    const text = `${article.title || ""}. ${article.description || ""}`;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-IN"; // Indian English
    utter.rate = 0.9;     // Slightly slower
    utter.voice =
      speechSynthesis
        .getVoices()
        .find((v) => v.lang === "en-IN" && v.name.includes("Female")) || null;

    utter.onend = () => {
      isReading = false;
      speakBtn.textContent = "🔊 Speak News";
    };

    synth.speak(utter);
    isReading = true;
    speakBtn.textContent = "⏹ Stop Reading";
  }
});

// Auto-fetch new news every hour
setInterval(fetchNews, 60 * 60 * 1000);

// Button event listeners
document.getElementById("next-btn").addEventListener("click", nextArticle);
document.getElementById("prev-btn").addEventListener("click", prevArticle);

// Initial fetch
fetchNews();
