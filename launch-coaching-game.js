// launch-coaching-game.js

let popupWindow = null;

document.addEventListener('DOMContentLoaded', function() {
  const continueBtn = document.querySelector('.continue-button');
  if (!continueBtn) return;

  continueBtn.addEventListener('click', function(e) {
    e.preventDefault(); // Stop default link behavior

    // Open coaching game in a popup window
    popupWindow = window.open(
      'https://bduhart.github.io/CMCT2-tests/',
      'CoachingGame',
      'width=1000,height=800'
    );
  });

  // Listen for messages from the coaching game
  window.addEventListener('message', function(event) {
    // debug line
    console.log('📩 Received message from game:', event.data);

    if (event.data?.type?.startsWith('console-')) {
      const level = event.data.type.replace('console-', '');
      const output = `[WebGL] ${event.data.data.join(' ')}`;
      console[level]?.(output);
      displayLog(level, output);
    }
  });
});

function displayLog(level, message) {
  const logBox = document.getElementById('webgl-log-output');
  if (logBox) {
    const line = document.createElement('div');
    line.textContent = message;
    line.className = `log-${level}`;
    logBox.appendChild(line);
  }
}
