console.log("📦 daily-assessment.js loaded");
 // Initialize Firebase
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
   let currentUser = null;
 
   // Helper: Format date as YYYY-MM-DD
   function formatDate(date) {
     return date.toISOString().split("T")[0];
   }
   
   // Generate calendar (7 days: today + 6 previous)
   function generateCalendar(completedDates = []) {
     const calendarContainer = document.getElementById("week-calendar");
     const today = new Date();
     const days = [];
   
     for (let i = 6; i >= 0; i--) {
       const day = new Date(today);
       day.setDate(today.getDate() - i);
       days.push(day);
     }
   
     calendarContainer.innerHTML = "";
   
     days.forEach((date) => {
       const dateStr = formatDate(date);
       const isToday = formatDate(date) === formatDate(today);
       const isCompleted = completedDates.includes(dateStr);
   
       const div = document.createElement("div");
       div.className = "calendar-day";
       if (isToday) div.classList.add("today");
   
       div.innerHTML = `
         <div>${date.getDate()}</div>
         <span class="star">${isCompleted ? "★" : "☆"}</span>
       `;
   
       div.addEventListener("click", async () => {
         if (!isCompleted) {
           if (dateStr !== formatDate(today)) {
             alert("You can only submit today’s assessment.");
           }
           return;
         }
       
         // Load data and show modal
         const docRef = db.collection("users").doc(currentUser.uid).collection("assessments").doc(dateStr);
         const snapshot = await docRef.get();
         const data = snapshot.data();
       
         if (data) {
           const body = document.getElementById("modal-body");
           body.innerHTML = `
             <p><strong>Date:</strong> ${data.date}</p>
             <h4>Symptoms</h4>
             <ul>
               ${Object.entries(data.symptoms).map(([k, v]) => `<li>${k}: ${v}</li>`).join('')}
             </ul>
             <h4>Exertion</h4>
             <ul>
               ${Object.entries(data.exertion).map(([k, v]) => `<li>${k}: ${v}</li>`).join('')}
             </ul>
           `;
           document.getElementById("view-modal").classList.remove("hidden");
         }
       });      
   
       calendarContainer.appendChild(div);
     });
   
     // Set Month label
     const monthName = today.toLocaleString('default', { month: 'long' });
     document.getElementById("month-label").textContent = monthName;
   }
   
   // Attach number labels under sliders
   function addSliderLabels() {
     document.querySelectorAll('input[type="range"]').forEach(slider => {
       const labelRow = document.createElement("div");
       labelRow.className = "slider-labels";
       for (let i = 1; i <= 5; i++) {
         const span = document.createElement("span");
         span.textContent = i;
         labelRow.appendChild(span);
       }
       slider.parentElement.appendChild(labelRow);
     });
   }
   
   // Submit handler
   document.getElementById("assessment-form").addEventListener("submit", async (e) => {
     e.preventDefault();
     const user = auth.currentUser;
     if (!user) {
       alert("User not signed in.");
       return;
     }
   
     const uid = user.uid;
     const dateStr = formatDate(new Date());
   
     // Gather form data
     const form = e.target;
     const data = {
       date: dateStr,
       timestamp: firebase.firestore.FieldValue.serverTimestamp(),
       symptoms: {
         wheezing: +form.wheezing.value,
         breath: +form.breath.value,
         chestTightness: +form.chestTightness.value,
         legSwelling: +form.legSwelling.value,
         sleepTrouble: +form.sleepTrouble.value
       },
       exertion: {
         rest: +form.rest.value,
         activity: +form.activity.value
       }
     };
   
     try {
       // Save to Firestore
       await db.collection("users").doc(uid)
         .collection("assessments").doc(dateStr)
         .set(data);
   
       // Show confirmation
       form.classList.add("hidden");
       document.getElementById("confirmation").classList.remove("hidden");
   
       setTimeout(() => {
         window.location.href = "dashboard.html";
       }, 2000);
     } catch (err) {
       console.error("Error submitting assessment:", err);
       alert("Failed to submit. Please try again.");
     }
   });
   
   // When user is authenticated, show calendar
   auth.onAuthStateChanged(async (user) => {
     if (!user) {
       window.location.href = "login.html";
       return;
     }
   
     currentUser = user; // <-- Save user globally
   
     try {
       const snapshot = await db.collection("users").doc(user.uid)
         .collection("assessments").get();
   
       const completedDates = [];
       snapshot.forEach(doc => {
         completedDates.push(doc.id);
       });
   
       generateCalendar(completedDates);
       addSliderLabels();
     } catch (err) {
       console.error("Error loading assessments:", err);
     }
   });
   
   function closeModal() {
     const modal = document.getElementById("view-modal");
     const modalBody = document.getElementById("modal-body");
   
     // Hide the modal
     modal.classList.add("hidden");
   
     // Clear out the old content safely
     modalBody.innerHTML = "";
   }
   
   document.addEventListener("DOMContentLoaded", () => {
     const closeBtn = document.getElementById("close-modal-btn");
     if (closeBtn) {
       closeBtn.addEventListener("click", closeModal);
     }
   });