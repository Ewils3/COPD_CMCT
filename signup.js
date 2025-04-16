// Firebase config (same as login.js)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    appId: "YOUR_APP_ID"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    // Get form values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const dob = document.getElementById("dob").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const accessCode = document.getElementById("accessCode").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      // Create user
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;
  
      // Store additional user data in Firestore
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
  