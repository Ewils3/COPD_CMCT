// dashboard.js

// Firebase config (same as login.js and signup.js)
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
  
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      const uid = user.uid;
      try {
        const doc = await db.collection("users").doc(uid).get();
        if (doc.exists) {
          const data = doc.data();
          const fullName = `${data.firstName} ${data.lastName}`;
          const nameHighlight = document.querySelector(".name-highlight");
          const userName = document.querySelector(".user-name");
          if (nameHighlight) nameHighlight.textContent = fullName;
          if (userName) userName.textContent = fullName;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      // Not logged in, redirect to login
      window.location.href = "login.html";
    }
  });
  