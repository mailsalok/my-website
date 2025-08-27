// auth-guard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyARJhReSWcQfXhTET1lVUsS9dy_eJhVtSo",
  authDomain: "mytutor-59383.firebaseapp.com",
  projectId: "mytutor-59383",
  storageBucket: "mytutor-59383.appspot.com",
  messagingSenderId: "94625775607",
  appId: "1:94625775607:web:d06cf7e691e071404bb8f2",
  measurementId: "G-F0GBF6QMN1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const userNameSpan = document.getElementById("user-name");
const logoutBtn = document.getElementById("logout-btn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.body.style.display = "block";
    if (userNameSpan) {
      userNameSpan.textContent = "Hi, " + (user.displayName || "Student");
    }

    // Background per page
    const pageName = window.location.pathname.split("/").pop().replace(".html", "");
    document.body.style.backgroundImage = `url('images/${pageName}-bg.jpg')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  } else {
    location.href = "index.html";
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    signOut(auth).then(() => {
      location.href = "index.html";
    }).catch((error) => {
      console.error("Logout error:", error);
    });
  });
}
