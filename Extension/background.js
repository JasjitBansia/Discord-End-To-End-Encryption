chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "encrypt") {
    fetch("http://localhost:17465/encrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plaintext: message.text, key: message.key }),
    })
      .then((res) => res.text())
      .then((data) => sendResponse({ ok: true, data }))
      .catch((err) => sendResponse({ ok: false, error: err.toString() }));

    return true;
  } else if (message.action === "decrypt") {
    fetch("http://localhost:17465/decrypt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encryptedtext: message.encryptedtext,
        key: message.key,
      }),
    })
      .then((res) => res.text())
      .then((data) => sendResponse({ ok: true, data }))
      .catch((err) => sendResponse({ ok: false, error: err.toString() }));

    return true;
  }
});
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    await chrome.tabs.sendMessage(tabId, {
      action: "urlChange",
      url: changeInfo.url,
    });
  }
});
