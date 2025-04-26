// video-bank.js

// Simulated user respiratory metrics (replace with Firebase later)
const userMetrics = {
    respiratoryRate: 22,  // example: 22 bpm
    FVC: 2.8,             // liters
    FEV1: 2.2,            // liters
    fev1FvcRatio: 0.65    // ratio
  };
  
  // Map conditions to video links
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
  
  // Function to generate the video list
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
  
  // Helper function to generate video sections
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
        section.appendChild(videoTitle);
  
        const iframe = document.createElement("iframe");
        
        // FIX: Properly format YouTube embed URL
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
  
  
  // Run display on page load
  window.onload = displayVideos;
  