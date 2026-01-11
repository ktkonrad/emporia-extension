let authToken = null;

// Listener to capture the auth token from outgoing requests
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    for (const header of details.requestHeaders) {
      if (header.name.toLowerCase() === 'authtoken') {
        authToken = header.value;
        // Save to storage so content script can access it
        chrome.storage.local.set({ 'emporia_token': authToken });
      }
    }
  },
  { urls: ["https://api.emporiaenergy.com/*"] },
  ["requestHeaders"]
);
