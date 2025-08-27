// live-news.js
const container = document.getElementById("news-container");
const speakBtn = document.getElementById("speak-btn");
const stopBtn = document.getElementById("stop-btn");
let articles = [];
let currentIndex = 0;
let synth = window.speechSynthesis;
let utter;

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

function showArticle(index) {
  container.innerHTML = "";
  const article = articles[index];
  const card = document.createElement("div");
  card.className = "news-card";
  const image = article.urlToImage
    ? `<img src="${article.urlToImage}" class="news-img">`
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

function speakArticle() {
  if (!articles.length) return;
  const article = articles[currentIndex];
  const text = `${article.title}. ${article.description || ""}`;
  utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-IN"; // Indian English accent
  utter.rate = 0.9;     // slightly slower
  synth.speak(utter);

  utter.onend = () => {
    // auto-advance after finishing reading
    currentIndex = (currentIndex + 1) % articles.length;
    showArticle(currentIndex);
    speakArticle();
  };
}

function stopSpeaking() {
  if (synth.speaking) synth.cancel();
}

document.getElementById("next-btn").addEventListener("click", () => {
  stopSpeaking();
  currentIndex = (currentIndex + 1) % articles.length;
  showArticle(currentIndex);
});
document.getElementById("prev-btn").addEventListener("click", () => {
  stopSpeaking();
  currentIndex = (currentIndex - 1 + articles.length) % articles.length;
  showArticle(currentIndex);
});
speakBtn.addEventListener("click", () => {
  stopSpeaking();
  speakArticle();
});
document.getElementById("stop-btn").addEventListener("click", stopSpeaking);

fetchNews();
// refresh news every 1 hour
setInterval(fetchNews, 60 * 60 * 1000);
