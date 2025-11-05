// Konfigurasi Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getDatabase, ref, onValue, set, push, get } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Elemen
const loginPage = document.getElementById('login-page');
const adminDashboard = document.getElementById('admin-dashboard');
const kasirPage = document.getElementById('kasir-page');
const loginBtn = document.getElementById('login-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('login-error');

loginBtn.addEventListener('click', async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userRef = ref(db, 'users/' + user.uid);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data.role === 'admin') {
        showPage('admin');
      } else {
        showPage('kasir');
      }
    }
  } catch (error) {
    loginError.textContent = 'Login gagal: ' + error.message;
  }
});

function showPage(role) {
  loginPage.classList.add('hidden');
  adminDashboard.classList.add('hidden');
  kasirPage.classList.add('hidden');
  if (role === 'admin') adminDashboard.classList.add('active');
  if (role === 'kasir') kasirPage.classList.add('active');
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userRef = ref(db, 'users/' + user.uid);
    get(userRef).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.role === 'admin') showPage('admin');
        else showPage('kasir');
      }
    });
  } else {
    loginPage.classList.add('active');
  }
});
