const container = document.getElementById("news-container");
const speakBtn = document.getElementById("speak-btn");
const stopBtn = document.getElementById("stop-btn");
let articles = [];
let currentIndex = 0;
let synth = window.speechSynthesis;
let utter;
let autoNext;

// Fetch news from serverless function
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

// Show single article
function showArticle(index) {
  container.innerHTML = "";
  const article = articles[index];
  const card = document.createElement("div");
  card.className = "news-card";

  const image = article.urlToImage
    ? `<img src="${article.urlToImage}" class="news-img" />`
    : "";
  const description = article.description || "No description available.";

  card.innerHTML = `
    ${image}
    <div class="news-title">${article.title || "Untitled"}</div>
    <div class="news-description">${description}</div>
    <a href="${article.url}" target="_blank" class="news-link">Read More</a>
  `;
  container.appendChild(card);

  // Read out the article automatically
  speakArticle(article);
}

// Speak an article
function speakArticle(article) {
  stopSpeaking();
  const text = `${article.title || ""}. ${article.description || ""}`;
  utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-IN"; // Indian English
  utter.rate = 0.9;     // slightly slower
  utter.voice = speechSynthesis.getVoices().find(v => v.name.includes("Google UK English Female") || v.name.includes("Indian")) || null;

  utter.onend = () => {
    // Move to next article automatically
    currentIndex = (currentIndex + 1) % articles.length;
    showArticle(currentIndex);
  };

  synth.speak(utter);
}

// Stop speaking
function stopSpeaking() {
  if (synth.speaking) synth.cancel();
}

// Button handlers
speakBtn.addEventListener("click", () => {
  if (!articles.length) return;
  speakArticle(articles[currentIndex]);
});
document.getElementById("stop-btn").addEventListener("click", stopSpeaking);

// Previous/Next buttons
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

// Auto-refresh news every 1 hour
setInterval(fetchNews, 60 * 60 * 1000); // 1 hour

fetchNews();
