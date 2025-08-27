import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyARJhReSWcQfXhTET1lVUsS9dy_eJhVtSo",
  authDomain: "mytutor-59383.firebaseapp.com",
  projectId: "mytutor-59383",
  storageBucket: "mytutor-59383.firebasestorage.app",
  messagingSenderId: "94625775607",
  appId: "1:94625775607:web:d06cf7e691e071404bb8f2",
  measurementId: "G-F0GBF6QMN1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Hide all body content initially
document.body.style.display = "none";

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in, show page
    document.body.style.display = "block";
  } else {
    // Not logged in, redirect to homepage
    alert("You must log in first!");
    window.location.href = "index.html";
  }
});
