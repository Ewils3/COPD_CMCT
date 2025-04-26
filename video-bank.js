// 📦 video-bank.js

// Simulated user respiratory metrics (later replace with real Firebase data)
const userMetrics = {
    respiratoryRate: 22,
    FVC: 2.8,
    FEV1: 2.2,
    fev1FvcRatio: 0.65
  };
  
  // Mapping conditions to videos
  const videoRecommendations = {
    respiratoryRate: [
      { min: 21, max: 35, videos: [
        { title: "Pursed Lip Breathing", url: "https://youtu.be/7kpJ0QlRss4" },
        { title: "Belly Breathing", url: "https://youtu.be/wai-GIYGMeo" }
      ]},
      { min: 36, max: 100, videos: [
        { title: "Pursed Lip Breathing", url: "https://youtu.be/7kpJ0QlRss4" },
        { title: "Belly Breathing", url: "https://youtu.be/wai-GIYGMeo" }
      ]}
    ],
    FVC: [
      { outOfRange: true, videos: [
        { title: "Belly Breathing", url: "https://youtu.be/wai-GIYGMeo" },
        { title: "Rib Stretching", url: "https://www.youtube.com/watch?v=w2ezNt8exMY" }
      ]}
    ],
    FEV1: [
      { outOfRange: true, videos: [
        { title: "Breathing Exercises Combo", url: "https://www.youtube.com/watch?v=-7-CAFhJn78" }
      ]}
    ],
    fev1FvcRatio: [
      { outOfRange: true, videos: [
        { title: "Aerobic Exercise", url: "https://www.youtube.com/watch?v=NB09d_xbpN8" },
        { title: "Breath Training", url: "https://www.youtube.com/watch?v=-7-CAFhJn78" }
      ]}
    ]
  };
  
  // 📦 Initialize Firebase
  if (!firebase.apps.length) {
    const firebaseConfig = {
      apiKey: "AIzaSyAC799b0bQP2QOn37g0Fjq_Lejwwb-MwY8",
      authDomain: "cmct-coaching-tool.firebaseapp.com",
      projectId: "cmct-coaching-tool",
      storageBucket: "cmct-coaching-tool.firebasestorage.app",
      messagingSenderId: "427203091725",
      appId: "1:427203091725:web:6a9d07b27a456d8d4d2444"
    };
    firebase.initializeApp(firebaseConfig);
  }
  
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // Helper: Format date as YYYY-MM-DD
  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }
  
  // 📦 Display videos
  function displayVideos() {
    const videoList = document.getElementById("video-list");
  
    // Respiratory Rate
    videoList.appendChild(generateSection("Respiratory Rate", userMetrics.respiratoryRate, videoRecommendations.respiratoryRate));
    
    // FVC
    if (userMetrics.FVC < 3.25 || userMetrics.FVC > 5.5) {
      videoList.appendChild(generateSection("FVC", userMetrics.FVC, videoRecommendations.FVC));
    }
  
    // FEV1
    if (userMetrics.FEV1 < 2.5 || userMetrics.FEV1 > 4.5) {
      videoList.appendChild(generateSection("FEV1", userMetrics.FEV1, videoRecommendations.FEV1));
    }
  
    // FEV1/FVC Ratio
    if (userMetrics.fev1FvcRatio < 0.7 || userMetrics.fev1FvcRatio > 0.85) {
      videoList.appendChild(generateSection("FEV1/FVC Ratio", userMetrics.fev1FvcRatio, videoRecommendations.fev1FvcRatio));
    }
  }
  
  // 📦 Create each video section
  function generateSection(title, value, conditions) {
    const section = document.createElement("div");
    section.className = "video-section";
  
    const heading = document.createElement("h2");
    heading.textContent = title;
    section.appendChild(heading);
  
    let matchedVideos = [];
  
    if (Array.isArray(conditions)) {
      for (const cond of conditions) {
        if (cond.min && cond.max) {
          if (value >= cond.min && value <= cond.max) {
            matchedVideos = cond.videos;
            break;
          }
        } else if (cond.outOfRange) {
          matchedVideos = cond.videos;
        }
      }
    }
  
    if (matchedVideos.length > 0) {
      matchedVideos.forEach(video => {
        const videoTitle = document.createElement("p");
        videoTitle.textContent = video.title;
        videoTitle.style.fontWeight = "bold";
        videoTitle.style.textAlign = "center";
        videoTitle.style.marginTop = "10px";
        section.appendChild(videoTitle);
  
        const iframe = document.createElement("iframe");
  
        // Format URL correctly for embed
        let embedUrl = video.url;
        if (embedUrl.includes("youtu.be")) {
          embedUrl = embedUrl.replace("https://youtu.be/", "https://www.youtube.com/embed/");
        } else if (embedUrl.includes("watch?v=")) {
          embedUrl = embedUrl.replace("watch?v=", "embed/");
        }
  
        iframe.src = embedUrl;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        section.appendChild(iframe);
      });
    } else {
      const normalText = document.createElement("p");
      normalText.textContent = "Your measurements are normal. No additional exercises needed!";
      section.appendChild(normalText);
    }
  
    return section;
  }
  
  // 📦 Complete Recommended Exercises Button
  document.getElementById("complete-exercises-btn").addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first.");
      return;
    }
  
    const uid = user.uid;
    const today = formatDate(new Date());
  
    try {
      await db.collection("users").doc(uid)
        .collection("exerciseCompletions").doc(today)
        .set({
          completed: true,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
  
      // ✅ Only disable the button and show a confirmation
      const completeBtn = document.getElementById("complete-exercises-btn");
      completeBtn.disabled = true;
      completeBtn.textContent = "✅ Exercises Completed! Redirecting...";
      completeBtn.style.backgroundColor = "green";
  
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    } catch (error) {
      console.error("Error completing exercises:", error);
      alert("Something went wrong. Please try again.");
    }
  });
  
  // 📦 Run display function on page load
  window.onload = displayVideos;
  