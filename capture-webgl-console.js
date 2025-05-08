// capture-webgl-console.js

window.addEventListener('message', function(event) {
    // Optionally restrict to your domain:
    // if (event.origin !== window.location.origin) return;
  
    if (event.data?.type?.startsWith('console-')) {
      const msgType = event.data.type.replace('console-', '');
      const output = `[WebGL] ${event.data.data.join(' ')}`;
  
      // Print to this page's console
      console[msgType]?.(output);
  
      // Optionally: Display on the webpage
      const logBox = document.getElementById('webgl-log-output');
      if (logBox) {
        const entry = document.createElement('div');
        entry.textContent = output;
        entry.className = `log-${msgType}`;
        logBox.appendChild(entry);
      }
    }
  });
  