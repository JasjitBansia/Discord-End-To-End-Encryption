async function storeToken() {
  let storedToken = await chrome.storage.local.get("token");
  let existingToken = storedToken.token;
  if (!existingToken) {
    let tokenStorage = window.localStorage.getItem("token");
    let token = tokenStorage.substring(1, tokenStorage.length - 1);
    await chrome.storage.local.set({ token: token });
  }
}
storeToken();
async function getData() {
  try {
    let objects = await chrome.storage.local.get(null);
    let URL = window.location.href;
    let channelId = URL.substring(URL.lastIndexOf("/") + 1, URL.length);
    let tokenStorage = await chrome.storage.local.get("token");
    let token = tokenStorage.token;

    let channelInfoReq = await fetch(
      `https://discord.com/api/v9/channels/${channelId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    let channelInfo = await channelInfoReq.json();
    let userId = channelInfo.recipients[0].id;

    let encryptionKey;

    for (const [key, value] of Object.entries(objects)) {
      if (key.split(" ")[0] === userId) {
        encryptionKey = value;
      }
    }
    main(channelId, encryptionKey, token);
  } catch (e) {
    console.log(e);
  }
}

function initialize(url) {
  try {
    if (url.startsWith("https://discord.com/channels/@me/"))
      loadTextElement = setInterval(async () => {
        let element = document.querySelector(".form_f75fb0");
        let object = await chrome.storage.local.get("encryptionMode");
        let encryptionState = object.encryptionMode;
        if (element !== null && encryptionState === true) {
          getData();
          clearInterval(loadTextElement);
        }
      }, 2000);
  } catch (e) {
    console.log(e);
  }
}
initialize(window.location.href);
async function main(channelId, encryptionKey, token) {
  try {
    document.querySelector(".form_f75fb0").style.display = "none";
    let customInput = document.querySelector("#message-input-div");
    if (customInput === null) {
      const bar = document.createElement("div");
      bar.id = "message-input-div";
      bar.innerHTML = `
    <input type="text" placeholder="Message..." id="message-input" />
    <button id="sendMessageButton">Send</button>
  `;
      const style = document.createElement("style");
      style.textContent = `
    #message-input-div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70%;
      height: 60px;
      padding: 10px;
      background: #2f3136;
      gap: 8px;
      box-sizing: border-box;
      border-radius: 10px;
      margin-left: 170px;
      margin-bottom: 10px
    }
    #message-input-div input {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      background: #40444b;
      color: #dcddde;
      font-size: 14px;
    }
    #message-input-div input::placeholder {
      color: #b9bbbe;
    }
    #message-input-div button {
      padding: 8px 14px;
      border: none;
      border-radius: 6px;
      background: #5865f2;
      color: white;
      font-weight: 600;
      cursor: pointer;
    }
  `;
      document.head.appendChild(style);
      document.querySelector(".chatContent_f75fb0").appendChild(bar);
    }
    let sendMessageButton = document.querySelector("#sendMessageButton");

    sendMessageButton.addEventListener("click", async () => {
      let messageInput = document.querySelector("#message-input");
      let message = messageInput.value.trim();
      if (message.length > 0) {
        if (!encryptionKey) return alert("No encryption key found");

        await chrome.runtime.sendMessage(
          { action: "encrypt", text: message, key: encryptionKey },
          async (res) => {
            if (res.ok) {
              let encryptedText = res.data;
              await fetch(
                `https://discord.com/api/v9/channels/${channelId}/messages`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                  },
                  body: JSON.stringify({ content: encryptedText }),
                }
              );
            } else {
              console.error(response.error);
            }
          }
        );
        messageInput.value = "";
      } else {
        alert("Empty message");
      }
    });
    decryptMessages(encryptionKey);
  } catch (e) {
    console.log(e);
  }
}

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "enableEncryption") {
    main();
  } else if (message.action === "addID") {
    let id = prompt("User ID of other user: ");
    id = id.trim();
    let username = prompt(
      "Username/nickname (just required for your easy reference): "
    );
    username = username.trim();
    let key = prompt("Key: ");
    key = key.trim();
    if (id && key) {
      chrome.storage.local.set({ [id + " " + username]: key });
      alert("User added successfully");
    } else {
      alert("Incomplete information entered");
    }
    window.location.reload();
  } else if (message.action === "urlChange") {
    let url = message.url;
    initialize(url);
  } else if (message.action === "initialize") {
    initialize(window.location.href);
  } else if (message.action === "reload") {
    window.location.reload();
  }
});
function decryptMessages(encryptionKey) {
  async function decrypt(messageContentSpan) {
    try {
      if (messageContentSpan.innerText.startsWith("U2FsdGVkX1")) {
        let encryptedMessage = messageContentSpan.innerText;
        if (!encryptionKey) return;
        await chrome.runtime.sendMessage(
          {
            action: "decrypt",
            encryptedtext: encryptedMessage,
            key: encryptionKey,
          },
          async (res) => {
            if (res.ok) {
              let decryptedText = res.data;
              messageContentSpan.innerText = decryptedText;
            } else {
              console.error(response.error);
            }
          }
        );
      }
    } catch (e) {
      console.log(e);
    }
  }
  document.querySelectorAll("li.messageListItem__5126c").forEach((li) => {
    let messageContentSpan = li
      .getElementsByTagName("div")[2]
      .getElementsByTagName("span")[0];
    decrypt(messageContentSpan);
  });
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((li) => {
        if (li.nodeType === Node.ELEMENT_NODE) {
          if (
            li.tagName.toLowerCase() === "li" &&
            li.classList.contains("messageListItem__5126c")
          ) {
            let messageContentSpan = li
              .getElementsByTagName("div")[2]
              .getElementsByTagName("span")[0];
            decrypt(messageContentSpan);
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
