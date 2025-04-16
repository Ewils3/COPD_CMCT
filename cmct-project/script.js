// Redirect from splash screen to login page after 2 seconds
window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000); // 2000ms = 2 seconds
  });
  