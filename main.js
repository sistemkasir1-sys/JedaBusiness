// Konfigurasi Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  onValue, 
  set, 
  push, 
  get 
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCr0qjNHlaZw-pGJ4oSf5M_5lbF38mrD6U",
  authDomain: "jedabusiness-9a170.firebaseapp.com",
  databaseURL: "https://jedabusiness-9a170-default-rtdb.firebaseio.com",
  projectId: "jedabusiness-9a170",
  storageBucket: "jedabusiness-9a170.firebasestorage.app",
  messagingSenderId: "446268971019",
  appId: "1:446268971019:web:5a975f06ac5e7a8ec50f0e",
  measurementId: "G-X04RVV9K30"
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

// Email admin
const ADMIN_EMAIL = "shysondiamond@gmail.com";

// Fungsi login
loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Tentukan role berdasarkan email
    if (user.email === ADMIN_EMAIL) {
      showPage('admin');
    } else {
      showPage('kasir');
    }

  } catch (error) {
    loginError.textContent = 'Login gagal: ' + error.message;
  }
});

// Fungsi untuk menampilkan halaman sesuai role
function showPage(role) {
  // Sembunyikan semua halaman
  loginPage.classList.add('hidden');
  adminDashboard.classList.add('hidden');
  kasirPage.classList.add('hidden');

  // Tampilkan sesuai role
  if (role === 'admin') {
    adminDashboard.classList.remove('hidden');
    adminDashboard.classList.add('active');
  } else if (role === 'kasir') {
    kasirPage.classList.remove('hidden');
    kasirPage.classList.add('active');
  }
}

// Pantau status login user
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.email === ADMIN_EMAIL) {
      showPage('admin');
    } else {
      showPage('kasir');
    }
  } else {
    loginPage.classList.remove('hidden');
    loginPage.classList.add('active');
  }
});
