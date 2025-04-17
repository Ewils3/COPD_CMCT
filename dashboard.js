// dashboard.js

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

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

auth.onAuthStateChanged(async (user) => {
  if (!user) return;
  const uid = user.uid;
  const today = formatDate(new Date());

  try {
    // Fetch user's first and last name from Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      const fullName = `${userData.firstName} ${userData.lastName}`;

      // Update dashboard header
      const nameHighlight = document.querySelector(".name-highlight");
      if (nameHighlight) {
        nameHighlight.textContent = fullName;
      }

      // Update sidebar user info
      const userName = document.querySelector(".user-name");
      if (userName) {
        userName.textContent = fullName;
      }
    }

    // Check if today's assessment is completed
    const doc = await db.collection("users").doc(uid)
      .collection("assessments").doc(today).get();

    if (doc.exists) {
      const checkContainer = document.querySelector("#assessment-box .checkbox-container");
      if (checkContainer) {
        const checkmark = document.createElement("img");
        checkmark.src = "images/checkmark.png"; // your checkmark image path
        checkmark.alt = "Completed";
        checkContainer.appendChild(checkmark);
      }
    }
  } catch (err) {
    console.error("Failed to load dashboard info:", err);
  }
});
