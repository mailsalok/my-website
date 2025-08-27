const container = document.getElementById("news-container");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");

let articles = [];
let currentIndex = 0;
let autoRead = false;
let synth = window.speechSynthesis;
let utter;

// Fetch news every 1 hour
const FETCH_INTERVAL = 60 * 60 * 1000;

async function fetchNews() {
  container.innerHTML = `<p class="loading">Loading news...</p>`;
  try {
    const res = await fetch("/api/live-news");
    if (!res.ok) throw new Error("Network error");
    articles = await res.json();
    if (!articles.length) container.innerHTML = "<p>No news available.</p>";
    else showArticle(0);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>⚠️ Failed to load news.</p>`;
  }
}

// Display a single article
function showArticle(index) {
  container.innerHTML = "";
  const article = articles[index];
  const card = document.createElement("div");
  card.className = "news-card";

  const image = article.urlToImage ? `<img src="${article.urlToImage}" alt="News Image" class="news-img">` : "";
  const description = article.description || "No description available.";

  card.innerHTML = `
    ${image}
    <div class="news-title">${article.title || "Untitled"}</div>
    <div class="news-description">${description}</div>
    <a href="${article.url}" target="_blank" class="news-link">Read More</a>
  `;

  container.appendChild(card);
  setTimeout(() => card.classList.add("show"), 50);
}

// Read the current article
function readCurrentArticle() {
  if (!articles.length || !autoRead) return;

  const article = articles[currentIndex];
  const text = `${article.title || ""}. ${article.description || ""}`;

  // Stop previous utterance if any
  if (utter) synth.cancel();

  utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-IN"; // Female Indian accent
  utter.rate = 0.85;    // Slower pace
  utter.pitch = 1.1;    // Slightly higher pitch

  utter.onend = () => {
    // Move to next article only after reading is done
    currentIndex = (currentIndex + 1) % articles.length;
    showArticle(currentIndex);
    if (autoRead) readCurrentArticle();
  };

  synth.speak(utter);
}

// Event listeners
document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % articles.length;
  showArticle(currentIndex);
  if (autoRead) readCurrentArticle();
});

document.getElementById("prev-btn").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + articles.length) % articles.length;
  showArticle(currentIndex);
  if (autoRead) readCurrentArticle();
});

startBtn.addEventListener("click", () => {
  if (!articles.length) return;
  autoRead = true;
  readCurrentArticle();
});

stopBtn.addEventListener("click", () => {
  autoRead = false;
  if (utter) synth.cancel();
});

// Auto-fetch new news every 1 hour
setInterval(fetchNews, FETCH_INTERVAL);

// Initial fetch
fetchNews();
