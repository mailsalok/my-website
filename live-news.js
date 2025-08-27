const url = "/api/live-news";

const container = document.getElementById("news-container");
const speakBtn = document.getElementById("speak-btn");
const stopBtn = document.getElementById("stop-btn");

let articles = [];
let currentIndex = 0;
let synth = window.speechSynthesis;
let currentUtter = null;

// Fetch news every 1 hour
async function fetchNews() {
  container.innerHTML = `<p class="loading">Loading news...</p>`;
  try {
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

function showArticle(index) {
  container.innerHTML = "";
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

function nextArticle() {
  if (!articles.length) return;
  currentIndex = (currentIndex + 1) % articles.length;
  showArticle(currentIndex);
}

function prevArticle() {
  if (!articles.length) return;
  currentIndex = (currentIndex - 1 + articles.length) % articles.length;
  showArticle(currentIndex);
}

function speakCurrent() {
  if (!articles.length) return;
  if (synth.speaking) synth.cancel();

  const article = articles[currentIndex];
  const text = `${article.title || ""}. ${article.description || ""}`;
  currentUtter = new SpeechSynthesisUtterance(text);

  // Thin female Indian voice with slower pace
  currentUtter.lang = "en-IN";
  currentUtter.rate = 0.9;
  currentUtter.pitch = 1.1;

  synth.speak(currentUtter);
}

// Stop speaking
function stopSpeaking() {
  if (synth.speaking) synth.cancel();
}

// Event listeners
document.getElementById("next-btn").addEventListener("click", nextArticle);
document.getElementById("prev-btn").addEventListener("click", prevArticle);
speakBtn.addEventListener("click", speakCurrent);
stopBtn.addEventListener("click", stopSpeaking);

// Initial fetch and auto-refresh every 1 hour
fetchNews();
setInterval(fetchNews, 1000 * 60 * 60);
