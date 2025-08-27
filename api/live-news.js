// live-news.js
const urlBase = "/api/live-news"; // serverless function URL

const container = document.getElementById("news-container");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const categorySelect = document.getElementById("category-select");
const countrySelect = document.getElementById("country-select");

let articles = [];
let currentIndex = 0;
let synth = window.speechSynthesis;
let isPlaying = false;
let utter;

// Fetch news from API with optional category and country
async function fetchNews(category = "", country = "") {
  container.innerHTML = `<p class="loading">Loading news...</p>`;
  try {
    let url = `${urlBase}?category=${category}&country=${country}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    articles = await res.json();
    if (!articles.length) container.innerHTML = "<p>No news available.</p>";
    else showArticle(0);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>⚠️ Failed to load news.</p>`;
  }
}

// Display article at current index
function showArticle(index) {
  container.innerHTML = "";
  const article = articles[index];
  const card = document.createElement("div");
  card.className = "news-card";

  const image = article.urlToImage ? `<img src="${article.urlToImage}" alt="News Image" class="news-img">` : "";
  const description = article.description || "No description available.";
  const meta = `<div class="news-meta">${article.source?.name || ""} | ${new Date(article.publishedAt).toLocaleString()}</div>`;

  card.innerHTML = `
    ${image}
    ${meta}
    <div class="news-title">${article.title || "Untitled"}</div>
    <div class="news-description">${description}</div>
    <a href="${article.url}" target="_blank" class="news-link">Read More</a>
  `;

  container.appendChild(card);
  setTimeout(() => card.classList.add("show"), 50);

  if (isPlaying) speakArticle(article);
}

function nextArticle() {
  if(!articles.length) return;
  currentIndex = (currentIndex + 1) % articles.length;
  showArticle(currentIndex);
}

function prevArticle() {
  if(!articles.length) return;
  currentIndex = (currentIndex - 1 + articles.length) % articles.length;
  showArticle(currentIndex);
}

function speakArticle(article) {
  if(utter) synth.cancel();
  const text = `${article.title || ""}. ${article.description || ""}`;
  utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-IN'; // Indian English
  utter.rate = 0.85;    // slower pace
  utter.pitch = 1.2;    // slightly higher female-like
  synth.speak(utter);
  utter.onend = () => {
    nextArticle(); // auto-read next after current finishes
  };
}

// Play and Pause buttons
playBtn.addEventListener("click", () => {
  if(!articles.length) return;
  isPlaying = true;
  speakArticle(articles[currentIndex]);
});

pauseBtn.addEventListener("click", () => {
  isPlaying = false;
  synth.cancel();
});

// Category / Country selectors
if(categorySelect) categorySelect.addEventListener("change", () => {
  fetchNews(categorySelect.value, countrySelect?.value || "");
});
if(countrySelect) countrySelect.addEventListener("change", () => {
  fetchNews(categorySelect?.value || "", countrySelect.value);
});

// Navigation buttons
document.getElementById("next-btn").addEventListener("click", nextArticle);
document.getElementById("prev-btn").addEventListener("click", prevArticle);

// Auto-fetch news every 1 hour
setInterval(() => {
  fetchNews(categorySelect?.value || "", countrySelect?.value || "");
}, 60*60*1000);

// Initial fetch
fetchNews();
