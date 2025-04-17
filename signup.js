// Firebase config (same as login.js)
const firebaseConfig = {
    apiKey: "AIzaSyAC799b0bQP2QOn37g0Fjq_Lejwwb-MwY8",
    authDomain: "cmct-coaching-tool.firebaseapp.com",
    projectId: "cmct-coaching-tool",
    storageBucket: "cmct-coaching-tool.firebasestorage.app",
    messagingSenderId: "427203091725",
    appId: "1:427203091725:web:6a9d07b27a456d8d4d2444"
  };
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Helper to get query parameters from URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user data from step 1 (from URL)
  const firstName = getQueryParam("firstName");
  const lastName = getQueryParam("lastName");
  const dob = getQueryParam("dob");
  const phone = getQueryParam("phone");
  const email = getQueryParam("email");
  const accessCode = getQueryParam("accessCode");

  // Get step 2 inputs
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    // Create user in Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    // Save user profile to Firestore
    await db.collection("users").doc(uid).set({
      firstName,
      lastName,
      dob,
      phone,
      email,
      accessCode,
      username,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Signup error:", error);
    alert("Signup failed: " + error.message);
  }
});