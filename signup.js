// Firebase config (same as login.js)
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
const db = firebase.firestore();

// Helper: Parse URL parameters
function getQueryParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

document.getElementById("signup-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Step 1 data from URL
  const firstName = getQueryParam("firstName");
  const lastName = getQueryParam("lastName");
  const dob = getQueryParam("dob");
  const phone = getQueryParam("phone");
  const accessCode = getQueryParam("accessCode");
  const email = getQueryParam("email");

  // Step 2 data from form
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user.uid;

    await db.collection("users").doc(uid).set({
      firstName,
      lastName,
      dob,
      phone,
      accessCode,
      email,
      username,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Registration successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Signup error:", error);
    alert("Error: " + error.message);
  }
});
