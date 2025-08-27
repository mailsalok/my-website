// live-news.js

const container = document.getElementById("news-container");
const speakBtn = document.getElementById("speak-btn");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const url = "/api/live-news"; // serverless function

let articles = [];
let currentIndex = 0;
let synth = window.speechSynthesis;
let isReading = false;
let autoFetchInterval;

// Fetch news from serverless function
async function fetchNews() {
  container.innerHTML = `<p class="loading">Loading news...</p>`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    articles = await res.json();
    if (!articles.length) container.innerHTML = "<p>No news available.</p>";
    else showArticle(currentIndex);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>⚠️ Failed to load news.</p>`;
  }
}

// Show article on page
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

// Speak the current article
function speakArticle() {
  if (!articles.length || isReading) return;
  isReading = true;

  const article = articles[currentIndex];
  const text = `${article.title || ""}. ${article.description || ""}`;
  const utter = new SpeechSynthesisUtterance(text);

  // Female Indian accent
  utter.lang = "en-IN";
  utter.pitch = 1.2;
  utter.rate = 0.9;

  utter.onend = () => {
    isReading = false;
    nextArticle(); // Automatically go to next after reading
  };

  synth.speak(utter);
}

// Stop reading
function stopReading() {
  if (synth.speaking) synth.cancel();
  isReading = false;
}

// Next / Prev article
function nextArticle() {
  stopReading();
  if (!articles.length) return;
  currentIndex = (currentIndex + 1) % articles.length;
  showArticle(currentIndex);
  speakArticle();
}

function prevArticle() {
  stopReading();
  if (!articles.length) return;
  currentIndex = (currentIndex - 1 + articles.length) % articles.length;
  showArticle(currentIndex);
  speakArticle();
}

// Event listeners
speakBtn.addEventListener("click", () => {
  if (isReading) stopReading();
  else speakArticle();
});

nextBtn.addEventListener("click", nextArticle);
prevBtn.addEventListener("click", prevArticle);

// Auto-fetch news every 1 hour
autoFetchInterval = setInterval(fetchNews, 60 * 60 * 1000); // 1 hour

// Initial fetch
fetchNews();
