// Firebase compat version (for basic HTML/JS projects)
const firebaseConfig = {
    apiKey: "AIzaSyAC799b0bQP2QOn37g0Fjq_Lejwwb-MwY8",
    authDomain: "cmct-coaching-tool.firebaseapp.com",
    projectId: "cmct-coaching-tool",
    storageBucket: "cmct-coaching-tool.firebasestorage.app",
    messagingSenderId: "427203091725",
    appId: "1:427203091725:web:6a9d07b27a456d8d4d2444"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert("Login successful!");
      window.location.href = "dashboard.html"; // or wherever you're redirecting
    } catch (error) {
      alert("Error: " + error.message);
    }
  });
  