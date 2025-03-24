function showCountdownAndRedirect() {
  // Create alert box container only if it doesn't exist
  if (!document.getElementById("countdownAlert")) {
    let alertBox = document.createElement("div");
    alertBox.id = "countdownAlert";
    alertBox.innerHTML = `
      <div class="alert-content">
        <p><strong>Warning:</strong> This website is blocked.</p>
        <p>Redirecting in <span id="countdownTimer">3</span> seconds...</p>
      </div>
    `;

    // Apply Glassmorphism styling
    alertBox.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 300px;
      padding: 20px;
      border-radius: 15px;
      background: rgba(0, 0, 0, 0.59);
      backdrop-filter: blur(10px);
      text-align: center;
      font-size: 16px;
      font-family: Arial, sans-serif;
      color: white;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      z-index: 9999;
    `;

    document.body.appendChild(alertBox);
  }

  // Countdown logic
  let countdown = 3;
  let countdownTimerElement = document.getElementById("countdownTimer");
  
  let countdownInterval = setInterval(() => {
    countdown--;
    if (countdownTimerElement) {
      countdownTimerElement.textContent = countdown; // Update the countdown number
    }

    if (countdown === 0) {
      clearInterval(countdownInterval);
      // Redirect to Task.html after countdown
      window.location.href = chrome.runtime.getURL("Task.html");
    }
  }, 1000);
}

function checkAndRedirect() {
  chrome.storage.sync.get("allowedSites", function (data) {
    var allowedSites = data.allowedSites || [];
    const taskPageUrl = chrome.runtime.getURL("Task.html");
    const currentUrl = window.location.href;

    // Allow access if the current URL is in the allowed list
    if (allowedSites.includes(currentUrl)) {
      return; // Do nothing, allow access
    }

    // If not in the allowed list and not already on Task.html, show countdown and redirect
    if (currentUrl !== taskPageUrl) {
      showCountdownAndRedirect();
    }
  });
}

// Run check on initial load
checkAndRedirect();

// Detect back button presses
window.addEventListener("popstate", checkAndRedirect);

// Watch for URL changes (SPA handling)
let lastUrl = window.location.href;
const observer = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    checkAndRedirect();
  }
});
observer.observe(document.body, { childList: true, subtree: true });
